#!/bin/bash
set -euo pipefail

CONFIG="/run/ujanix/exam-config.json"
RULES="/run/ujanix/firewall.nft"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[INFO] Memulai konfigurasi firewall Ujianix..."

if [ ! -f "$CONFIG" ]; then
    echo "[ERROR] Konfigurasi tidak ditemukan."
    exit 1
fi

python3 "$SCRIPT_DIR/validate-config.py" "$CONFIG"

python3 - "$CONFIG" "$RULES" <<'PY'
import json
import ipaddress
import sys

config_path, rules_path = sys.argv[1:3]

with open(config_path) as f:
    config = json.load(f)

mode = config["mode"]
ips = config["network"]["allowed_ips"]
ports = config["network"]["allowed_ports"]

lines = [
    "table inet ujianix {",
    "    chain output {",
    "        type filter hook output priority 0;",
        "        policy drop;",
        "        oifname \"lo\" accept",
        "        ct state established,related accept",
]

if mode == "online":
    for ip in ips:
        ipaddress.ip_address(ip)
        for port in ports:
            lines.append(
                f"        ip daddr {ip} tcp dport {port} accept"
            )

lines += [
    "    }",
    "}",
]

with open(rules_path, "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"[INFO] Mode: {mode.upper()}")
print(f"[INFO] IP whitelist: {len(ips)}")
print(f"[INFO] Port whitelist: {len(ports)}")
print(f"[OK] Aturan dibuat: {rules_path}")
PY

echo "[INFO] Memeriksa sintaks nftables..."
nft -c -f "$RULES"

echo "[OK] Aturan firewall siap diuji."
echo "[INFO] Firewall belum diterapkan ke sistem."
