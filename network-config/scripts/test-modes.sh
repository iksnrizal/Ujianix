#!/bin/bash

set -euo pipefail

CONFIG_DIR="$(cd "$(dirname "$0")/../config" && pwd)"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

RUNTIME_CONFIG="/run/ujanix/exam-config.json"
RUNTIME_RULES="/run/ujanix/firewall.nft"

BACKUP="$(mktemp)"
sudo cp "$RUNTIME_CONFIG" "$BACKUP"

restore_config() {
    sudo cp "$BACKUP" "$RUNTIME_CONFIG"
    rm -f "$BACKUP"
}

trap restore_config EXIT

test_mode() {
    local mode="$1"
    local ip="$2"
    local port="$3"
    local config_file="$4"

    echo
    echo "=== TEST MODE: $mode ==="

    python3 "$SCRIPT_DIR/validate-config.py" "$config_file"

    sudo cp "$config_file" "$RUNTIME_CONFIG"
    sudo bash "$SCRIPT_DIR/apply-firewall.sh"

    if [[ "$mode" == "ONLINE" ]]; then
    sudo grep -Fq "ip daddr $ip tcp dport $port accept" "$RUNTIME_RULES"
    echo "[OK] Whitelist online ditemukan."
    else
        if sudo grep -Fq "ip daddr" "$RUNTIME_RULES"; then
        echo "[ERROR] Mode offline masih memiliki aturan whitelist IP."
        return 1
        fi
        echo "[OK] Mode offline tidak memiliki whitelist IP."
    fi

    sudo grep -Fq "policy drop;" "$RUNTIME_RULES"
    echo "[OK] Policy DROP ditemukan."

    echo "[OK] Mode $mode berhasil."
}

# Online
test_mode "ONLINE" "192.168.1.10" "443" "$CONFIG_DIR/exam-config.json"

# Offline
OFFLINE_CONFIG="$(mktemp)"

python3 - "$CONFIG_DIR/exam-config.json" "$OFFLINE_CONFIG" <<'PY'
import json
import sys

with open(sys.argv[1]) as f:
    config = json.load(f)

config["mode"] = "offline"
config["server"]["ip"] = "192.168.1.20"
config["server"]["port"] = 8080
config["network"]["allowed_ips"] = ["192.168.1.20"]
config["network"]["allowed_ports"] = [8080]

with open(sys.argv[2], "w") as f:
    json.dump(config, f, indent=2)
PY

test_mode "OFFLINE" "192.168.1.20" "8080" "$OFFLINE_CONFIG"

rm -f "$OFFLINE_CONFIG"

echo
echo "[SUCCESS] ONLINE dan OFFLINE berhasil diuji."
