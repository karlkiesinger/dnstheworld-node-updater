const Service = require("node-windows").Service;

const svc = new Service({
  name: "DNSTheWorld IP Updater",
  script: "C:\\dnstheworld\\update-ip.js",
});

svc.on("uninstall", () => console.log("Service uninstalled."));
svc.uninstall();
