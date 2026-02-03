# dnstheworld-node-updater
Node.js dynamic IP updater for DNSTheWorld using ipify, with automatic retries, Windows service support, and local health/status endpoints.

A lightweight Node.js background service that:

Detects the public IP address using ipify

Updates DNSTheWorld via apiupdate.dnstheworld.com

Runs automatically every 3 minutes

Exposes a local heartbeat / status API

Can run silently on Windows as a service

This software mirrors the behavior of the DNSTheWorld hardware IP Uploader.

Repository Contents
.
├── update-ip.js   # Main updater + status server
├── install-service.js         # Windows service installer
├── uninstall-service.js       # Windows service remover
├── package.json
├── README.md

Features

✅ Public IP detection (IPv4)

✅ GET-based update format
CLIENT_LINK/ip=1.1.1.1

✅ Automatic update every 3 minutes

✅ Background execution

✅ Local status & health endpoints

✅ Windows service support

✅ No UI required (tray app optional)

Requirements

Node.js v16+

Windows, Linux, or macOS

Outbound HTTPS access

Installation (GitHub)
1. Clone the repository
git clone https://github.com/YOUR_ORG_OR_USER/dnstheworld-node-updater.git
cd dnstheworld-node-updater

2. Install dependencies
npm install

Configuration

Set your DNSTheWorld Client Link using environment variables (recommended):

Windows
setx DTW_client_Link YOUR_CLIENT_LINK_HERE

Linux / macOS
export DTW_client_Link=YOUR_CLIENT_LINK_HERE


The updater sends updates to:

https://apiupdate.dnstheworld.com/CLIENT_LINK/ip=1.1.1.1

Run Manually (Test Mode)
node update-ip.js


What happens:

IP update runs immediately

Repeats every 3 minutes

Local status server starts on port 8080

Local Status Endpoints
Endpoint	Description
/health	Simple alive check
/heartbeat	Minimal runtime info
/status	Full detailed state
/healthz	Returns 200 or 503 if unhealthy
Example
http://127.0.0.1:8080/status

Environment Variables
Variable	Description	Default
DTW_client_Link	DNSTheWorld Client Link	required
PORT	Status server port	8080

Example:

PORT=9090 node update-ip.js

Run Automatically on Windows (Service Mode)
1. Install node-windows
npm install -g node-windows

2. Install the service (Admin Command Prompt)
node install-service.js


The updater will now:

Start automatically on boot

Run in the background

Restart if it crashes

Service name
DNSTheWorld IP Updater

Uninstall Windows Service
node uninstall-service.js

Logging

Logs are written to:

Console output (manual run)

Windows Service logs (service mode)

Example log:

[2026-02-03T14:12:00Z] OK ip=73.xxx.xxx.xxx http=200

Security Notes

Client Link transmitted over HTTPS

Local status server binds to localhost

No inbound internet access required

Safe for NAT / CGNAT environments

Typical Use Cases

DNSTheWorld IP monitoring

Alarm and monitoring systems

Servers with dynamic public IPs

Backup DDNS updates

Dealer or enterprise deployments

License

© DNSTheWorld LLC
https://dnstheworld.com
All rights reserved.
