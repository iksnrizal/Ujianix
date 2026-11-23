#!/usr/bin/env python3
# Server pengawas Ujianix. Jalankan: py ujianix-pengawas.py [port]
import io
import re
import secrets
import socket
import sys
import time
import zipfile
from html import escape
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
HERE = Path(__file__).resolve().parent
DATA = HERE / "data-pengawasan"
TOKEN_FILE = HERE / "pengawas-kode.txt"
MAX_BYTES = 8 * 1024 * 1024
LOGO = "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"
SAFE = re.compile(r"^[A-Za-z0-9._-]{1,80}$")
ACTIVE_WINDOW = 90
SEEN = {}


def load_token():
    if TOKEN_FILE.exists():
        value = TOKEN_FILE.read_text(encoding="utf-8").strip()
        if re.fullmatch(r"[A-Za-z0-9_-]{8,64}", value):
            return value
    value = secrets.token_urlsafe(9)
    TOKEN_FILE.write_text(value + "\n", encoding="utf-8")
    return value


TOKEN = load_token()

CSS = """
:root{--ink:#263238;--navy:#1B2A49;--blue:#2867A8;--bg:#F4F6F8;--line:#D8DEE5;--muted:#52616B}
*{box-sizing:border-box}
body{margin:0;padding:28px 16px;background:var(--bg);color:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif}
.wrap{max-width:1100px;margin:0 auto}
header{display:flex;align-items:center;gap:14px;margin-bottom:22px}
header img{width:52px;height:52px}
.brand{font-size:12px;font-weight:700;letter-spacing:3px;color:var(--blue)}
h1{margin:2px 0 0;font-size:24px;color:var(--navy)}
.sum{margin-left:auto;text-align:right;color:var(--muted);font-size:13px}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px;margin-bottom:18px}
.top{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.card h2{margin:0;font-size:18px;color:var(--navy)}
.badge{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600}
.on{background:#E6F4EC;color:#1E6B45}
.off{background:#FDECEA;color:#B3261E}
.dl{margin-left:auto;font-size:13px;color:var(--blue);text-decoration:none;font-weight:600}
.meta{color:var(--muted);font-size:13px;margin:4px 0 14px}
.cols{display:grid;grid-template-columns:2fr 1fr;gap:18px}
h3{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--muted)}
.big{width:100%;border:1px solid var(--line);border-radius:8px;display:block}
.thumbs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.thumbs img{width:84px;height:56px;object-fit:cover;border:1px solid var(--line);border-radius:5px}
.empty{color:var(--muted);font-size:13px;padding:18px;border:1px dashed var(--line);border-radius:8px;text-align:center}
ul{margin:0;padding-left:18px;font-size:13px;line-height:1.7}
footer{color:var(--muted);font-size:12px;text-align:center;margin-top:20px}
@media(max-width:760px){.cols{grid-template-columns:1fr}}
"""

SCRIPT = (
    "<script>setInterval(function(){fetch(location.href,{cache:'no-store'})"
    ".then(function(r){return r.text();}).then(function(t){"
    "var d=new DOMParser().parseFromString(t,'text/html').getElementById('app');"
    "if(d){document.getElementById('app').innerHTML=d.innerHTML;}})"
    ".catch(function(){});},10000);</script>"
)


def clean(name):
    return re.sub(r"[^A-Za-z0-9._-]", "_", name)[:80] or "perangkat"


def stamp(name):
    m = re.match(r"(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})", name)
    if not m:
        return name
    y, mo, d, h, mi, s = m.groups()
    return f"{d}/{mo}/{y} {h}:{mi}:{s}"


def last_seen(folder):
    times = [SEEN.get(folder.name, 0)]
    for f in folder.iterdir():
        try:
            times.append(f.stat().st_mtime)
        except OSError:
            pass
    return max(times)


def images(folder, kind):
    files = list(folder.glob(f"*-{kind}*.jpg")) + list(folder.glob(f"*-{kind}*.png"))
    return sorted(files, key=lambda f: f.name, reverse=True)


def block(prefix, dev, files, title):
    if not files:
        return f"<div><h3>{title}</h3><div class='empty'>Belum ada kiriman</div></div>"
    newest = files[0]
    thumbs = "".join(
        f"<a href='{prefix}/img/{dev}/{f.name}' target='_blank'>"
        f"<img src='{prefix}/img/{dev}/{f.name}' title='{stamp(f.name)}'></a>"
        for f in files[:14]
    )
    return (
        f"<div><h3>{title} - {stamp(newest.name)}</h3>"
        f"<a href='{prefix}/img/{dev}/{newest.name}' target='_blank'>"
        f"<img class='big' src='{prefix}/img/{dev}/{newest.name}'></a>"
        f"<div class='thumbs'>{thumbs}</div></div>"
    )


def page(prefix):
    DATA.mkdir(exist_ok=True)
    now = time.time()
    cards = []
    active = 0
    folders = sorted(p for p in DATA.iterdir() if p.is_dir())
    for d in folders:
        shots = images(d, "screenshot")
        cams = images(d, "webcam")
        seen = last_seen(d)
        is_on = now - seen <= ACTIVE_WINDOW
        active += 1 if is_on else 0
        badge = (
            "<span class='badge on'>Aktif</span>" if is_on else
            f"<span class='badge off'>Terputus - terakhir {time.strftime('%H:%M:%S', time.localtime(seen))}</span>"
        )
        events = []
        log = d / "events.log"
        if log.exists():
            events = log.read_text(encoding="utf-8", errors="replace").splitlines()[-12:][::-1]
        ev = "".join(f"<li>{escape(e)}</li>" for e in events) or "<li>Belum ada kejadian</li>"
        cards.append(
            f"<section class='card'><div class='top'><h2>{escape(d.name)}</h2>{badge}"
            f"<a class='dl' href='{prefix}/zip/{d.name}'>Unduh semua (ZIP)</a></div>"
            f"<div class='meta'>{len(shots)} screenshot, {len(cams)} foto webcam</div>"
            f"<div class='cols'>{block(prefix, d.name, shots, 'Screenshot terbaru')}"
            f"{block(prefix, d.name, cams, 'Webcam terbaru')}</div>"
            f"<h3 style='margin-top:16px'>Kejadian</h3><ul>{ev}</ul></section>"
        )
    body = "".join(cards) or (
        "<div class='card'><div class='empty'>Menunggu perangkat peserta mengirim data...</div></div>"
    )
    return (
        "<!doctype html><html lang='id'><head><meta charset='utf-8'>"
        "<meta name='viewport' content='width=device-width, initial-scale=1'>"
        "<title>Pengawas Ujianix</title>"
        f"<style>{CSS}</style></head><body><div class='wrap'><header>"
        f"<img src='data:image/png;base64,{LOGO}' alt='Ujianix'>"
        "<div><div class='brand'>UJIANIX</div><h1>Pemantauan Peserta</h1></div>"
        f"<div class='sum'>{active} dari {len(folders)} perangkat aktif</div></header>"
        f"<div id='app'>{body}</div>"
        "<footer>Halaman diperbarui otomatis setiap 10 detik.</footer>"
        f"</div>{SCRIPT}</body></html>"
    )


class Handler(BaseHTTPRequestHandler):
    def reply(self, code, body, ctype="text/plain; charset=utf-8", extra=None):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for key, value in (extra or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(body)

    def route(self):
        path = self.path.split("?")[0]
        parts = [p for p in path.split("/") if p]
        if parts and secrets.compare_digest(parts[0].encode("utf-8", "ignore"), TOKEN.encode("ascii")):
            return "/" + TOKEN, "/" + "/".join(parts[1:])
        if self.client_address[0] in ("127.0.0.1", "::1"):
            return "", path
        return None

    def do_GET(self):
        routed = self.route()
        if routed is None:
            return self.reply(403, "Akses ditolak. Gunakan alamat lengkap beserta kode dari server pengawas.")
        prefix, path = routed
        if path in ("", "/"):
            return self.reply(200, page(prefix), "text/html; charset=utf-8")
        parts = path.strip("/").split("/")
        if len(parts) == 3 and parts[0] == "img" and SAFE.match(parts[1]) and SAFE.match(parts[2]):
            f = DATA / parts[1] / parts[2]
            if f.is_file() and f.suffix in (".jpg", ".png"):
                ctype = "image/png" if f.suffix == ".png" else "image/jpeg"
                return self.reply(200, f.read_bytes(), ctype)
        if len(parts) == 2 and parts[0] == "zip" and SAFE.match(parts[1]):
            folder = DATA / parts[1]
            if folder.is_dir():
                buf = io.BytesIO()
                with zipfile.ZipFile(buf, "w", zipfile.ZIP_STORED) as z:
                    for f in sorted(folder.iterdir()):
                        if f.is_file():
                            z.write(f, f.name)
                return self.reply(200, buf.getvalue(), "application/zip",
                                  {"Content-Disposition": 'attachment; filename="%s.zip"' % parts[1]})
        self.reply(404, "Tidak ditemukan")

    def do_POST(self):
        routed = self.route()
        if routed is None:
            return self.reply(403, "Ditolak")
        if routed[1] != "/upload":
            return self.reply(404, "Tidak ditemukan")
        try:
            size = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            return self.reply(400, "Ukuran tidak valid")
        if not 0 < size <= MAX_BYTES:
            return self.reply(413, "Ukuran tidak diizinkan")
        device = clean(self.headers.get("X-Ujianix-Device", "perangkat"))
        kind = self.headers.get("X-Ujianix-Kind", "")
        body = self.rfile.read(size)
        SEEN[device] = time.time()
        folder = DATA / device
        folder.mkdir(parents=True, exist_ok=True)
        if kind == "ping":
            return self.reply(200, "ok")
        if kind == "event":
            text = body.decode("utf-8", "replace")[:300].replace("\n", " ")
            with open(folder / "events.log", "a", encoding="utf-8") as f:
                f.write(time.strftime("%d/%m %H:%M:%S") + "  " + text + "\n")
        elif kind in ("screenshot", "webcam"):
            if body[:3] == b"\xff\xd8\xff":
                ext = ".jpg"
            elif body[:8] == b"\x89PNG\r\n\x1a\n":
                ext = ".png"
            else:
                return self.reply(400, "Format gambar tidak didukung")
            base = time.strftime("%Y%m%d-%H%M%S") + "-" + kind
            target = folder / (base + ext)
            n = 1
            while target.exists():
                n += 1
                target = folder / f"{base}-{n}{ext}"
            target.write_bytes(body)
        else:
            return self.reply(400, "Jenis tidak dikenal")
        print(time.strftime("%H:%M:%S"), device, kind, size, "byte")
        self.reply(200, "ok")

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    DATA.mkdir(exist_ok=True)
    try:
        ips = [i for i in socket.gethostbyname_ex(socket.gethostname())[2] if not i.startswith("127.")]
    except OSError:
        ips = []
    print("Server pengawas Ujianix berjalan.")
    print("Galeri di komputer ini : http://127.0.0.1:%d" % PORT)
    print("Isi kolom 'Alamat server pengawas' di Ujianix dengan SALAH SATU alamat ini:")
    for ip in ips:
        print("   http://%s:%d/%s" % (ip, PORT, TOKEN))
    print("Kode di akhir alamat adalah kunci agar hanya perangkat Ujianix Anda yang bisa mengirim data.")
    print("Jika diminta, izinkan Python di Windows Firewall. Tekan Ctrl+C untuk berhenti.")
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
