const Service = require("node-windows").Service;

const svc = new Service({
  name: "DNSTheWorld IP Updater",
  description: "Updates public IP every 3 minutes and serves local status on port 8080.",
  script: "C:\\dnstheworld\\update-ip.js",
  env: [{
    name: "DTW_API_KEY",
    value: "PUT_YOUR_API_KEY_HERE"
  }]
});

svc.on("install", () => {
  svc.start();
  console.log("Service installed + started.");
});

svc.install();
