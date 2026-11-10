#!/bin/bash

set -euo pipefail

CONFIG="/run/ujanix/exam-config.json"
RULES="/run/ujanix/firewall.nft"

echo "[INFO] Memulai konfigurasi firewall Ujianix..."

# Memastikan konfigurasi tersedia
if [ ! -f "$CONFIG" ]; then
    echo "[ERROR] Konfigurasi tidak ditemukan."
    exit 1
fi

# Lokasi validator
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Validasi konfigurasi
python3 "$SCRIPT_DIR/validate-config.py" "$CONFIG"

# Membaca mode dan server
readarray -t CONFIG_DATA < <(python3 -c '
import json
with open("/run/ujanix/exam-config.json") as f:
    c = json.load(f)

print(c["mode"])
print(c["server"]["ip"])
print(c["server"]["port"])
')

MODE="${CONFIG_DATA[0]}"
SERVER_IP="${CONFIG_DATA[1]}"
SERVER_PORT="${CONFIG_DATA[2]}"

# Memeriksa mode
case "$MODE" in
    online)
        echo "[INFO] Mode ujian: ONLINE"
        ;;
    offline)
        echo "[INFO] Mode ujian: OFFLINE"
        ;;
    *)
        echo "[ERROR] Mode tidak dikenal."
        exit 1
        ;;
esac

echo "[INFO] Server: $SERVER_IP"
echo "[INFO] Port: $SERVER_PORT"

# Membuat aturan firewall
cat > "$RULES" <<EOF
table inet ujianix {
    chain output {
        type filter hook output priority 0;
        policy drop;

        oifname "lo" accept

        ct state established,related accept

        ip daddr $SERVER_IP tcp dport $SERVER_PORT accept
    }
}
EOF

echo "[INFO] File aturan firewall berhasil dibuat:"
echo "$RULES"

echo "[INFO] Firewall belum diterapkan ke sistem."
echo "[OK] Aturan firewall siap diuji."
