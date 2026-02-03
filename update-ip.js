const axios = require("axios");
const express = require("express");

// ===== CONFIG =====
const API_KEY = process.env.DTW_client_Link || "PUT_YOUR_CLIENT_LINK_HERE";
const PORT = process.env.PORT || 8080;

// ========== you should not need to edit under this line ========= //
const UPDATE_BASE = "https://apiupdate.dnstheworld.com/"; 
const INTERVAL_MS = 3 * 60 * 1000; // 3 minutes


// If your endpoint path is different, change this:
function buildUpdateUrl(ip) {
  // Format: (api key)/ip=1.1.1.1
  return `${UPDATE_BASE}${encodeURIComponent(API_KEY)}/${encodeURIComponent(ip)}`;
}

// ===== RUNTIME STATE =====
const state = {
  started_at: new Date().toISOString(),
  last_tick_at: null,
  last_success_at: null,
  last_ip: null,
  last_http_status: null,
  last_response_snip: null,
  last_error: null,
  consecutive_failures: 0,
};

async function getPublicIp() {
 const res = await axios.get("https://api.ipify.org?format=json", { timeout: 10000 });
  return res.data.ip;
}

async function tick() {
  state.last_tick_at = new Date().toISOString();

  try {
    const ip = await getPublicIp();
    state.last_ip = ip;

    const url = buildUpdateUrl(ip);
    const res = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true,
    });

    state.last_http_status = res.status;
    const body = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
    state.last_response_snip = body.slice(0, 250);

    if (res.status !== 200) throw new Error(`Update failed: HTTP ${res.status}`);

    state.last_success_at = new Date().toISOString();
    state.last_error = null;
    state.consecutive_failures = 0;

    console.log(`[${state.last_success_at}] OK ip=${ip} http=${res.status}`);
  } catch (err) {
    state.last_error = err.message;
    state.consecutive_failures += 1;
    console.error(`[${new Date().toISOString()}] ERROR: ${err.message}`);
  }
}

// Run once now, then every 3 minutes
tick();
setInterval(tick, INTERVAL_MS);

// ===== LOCAL STATUS SERVER =====
const app = express();

app.get("/health", (req, res) => res.status(200).send("OK"));

app.get("/heartbeat", (req, res) => {
  res.json({
    now: new Date().toISOString(),
    started_at: state.started_at,
    last_tick_at: state.last_tick_at,
    last_success_at: state.last_success_at,
    consecutive_failures: state.consecutive_failures,
  });
});

app.get("/status", (req, res) => res.json({ now: new Date().toISOString(), ...state }));

app.get("/healthz", (req, res) => {
  const MAX_FAILS = 3;
  if (state.consecutive_failures >= MAX_FAILS) {
    return res.status(503).json({ ok: false, reason: "too_many_failures", ...state });
  }
  res.status(200).json({ ok: true, ...state });
});

app.listen(PORT, () => {
  console.log(`Status server: http://127.0.0.1:${PORT}/status`);
});

