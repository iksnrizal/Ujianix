#!/usr/bin/env python3

import json
import ipaddress
import sys
from pathlib import Path


def validate_config(config_path):
    path = Path(config_path)

    # 1. Periksa file
    if not path.is_file():
        raise ValueError("File konfigurasi tidak ditemukan.")

    # 2. Baca JSON
    try:
        with path.open("r", encoding="utf-8") as file:
            config = json.load(file)
    except json.JSONDecodeError as error:
        raise ValueError(f"JSON tidak valid: {error}")

    # 3. Periksa struktur utama
    if not isinstance(config, dict):
        raise ValueError("Konfigurasi harus berupa object JSON.")

    required_keys = {
        "version",
        "mode",
        "server",
        "network",
        "monitoring"
    }

    if set(config.keys()) != required_keys:
        raise ValueError("Struktur konfigurasi tidak sesuai.")

    # 4. Periksa versi
    if type(config["version"]) is not int:
        raise ValueError("Version harus berupa integer.")

    if config["version"] != 1:
        raise ValueError("Versi konfigurasi tidak didukung.")

    # 5. Periksa mode
    if config["mode"] not in ["online", "offline"]:
        raise ValueError("Mode harus online atau offline.")

    # 6. Periksa server
    server = config["server"]

    if not isinstance(server, dict):
        raise ValueError("Server harus berupa object.")

    if set(server.keys()) != {"ip", "port"}:
        raise ValueError("Struktur server tidak sesuai.")

    try:
        ipaddress.ip_address(server["ip"])
    except (ValueError, TypeError):
        raise ValueError("IP server tidak valid.")

    if type(server["port"]) is not int:
        raise ValueError("Port server harus integer.")

    if not 1 <= server["port"] <= 65535:
        raise ValueError("Port server di luar rentang valid.")

    # 7. Periksa network
    network = config["network"]

    if not isinstance(network, dict):
        raise ValueError("Network harus berupa object.")

    if set(network.keys()) != {"allowed_ips", "allowed_ports"}:
        raise ValueError("Struktur network tidak sesuai.")

    allowed_ips = network["allowed_ips"]
    allowed_ports = network["allowed_ports"]

    if not isinstance(allowed_ips, list) or not allowed_ips:
        raise ValueError("Allowed IP harus berupa list tidak kosong.")

    for ip in allowed_ips:
        try:
            ipaddress.ip_address(ip)
        except (ValueError, TypeError):
            raise ValueError(f"IP whitelist tidak valid: {ip}")

    if not isinstance(allowed_ports, list) or not allowed_ports:
        raise ValueError("Allowed ports harus berupa list tidak kosong.")

    for port in allowed_ports:
        if type(port) is not int:
            raise ValueError("Port whitelist harus integer.")

        if not 1 <= port <= 65535:
            raise ValueError(f"Port whitelist tidak valid: {port}")

    # 8. Periksa monitoring
    monitoring = config["monitoring"]

    if not isinstance(monitoring, dict):
        raise ValueError("Monitoring harus berupa object.")

    if set(monitoring.keys()) != {"enabled", "webcam"}:
        raise ValueError("Struktur monitoring tidak sesuai.")

    if type(monitoring["enabled"]) is not bool:
        raise ValueError("Monitoring enabled harus boolean.")

    if type(monitoring["webcam"]) is not bool:
        raise ValueError("Webcam harus boolean.")

    # 9. Periksa server masuk whitelist
    if server["ip"] not in allowed_ips:
        raise ValueError("IP server tidak ada di whitelist.")

    if server["port"] not in allowed_ports:
        raise ValueError("Port server tidak ada di whitelist.")

    return True


def main():
    if len(sys.argv) != 2:
        print("Penggunaan:")
        print("python3 validate-config.py <file-config.json>")
        sys.exit(2)

    config_path = sys.argv[1]

    try:
        validate_config(config_path)
        print("[OK] Konfigurasi valid.")
        sys.exit(0)

    except ValueError as error:
        print(f"[ERROR] {error}")
        sys.exit(1)


if __name__ == "__main__":
    main()
