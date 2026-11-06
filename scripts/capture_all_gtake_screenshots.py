import os
import time
import json
import base64
import urllib.request
import subprocess
import requests
import re
import websocket

BASE_URL = "http://localhost:8090"
ROOT_DIR = r"C:\Users\A\Documents\Codex\2026-10-29\files-pasted-by-the-user-mirai\outputs\mirainova-landing-page"
OUT_DIR = os.path.join(ROOT_DIR, "screenshots", "gtake-ui")
os.makedirs(OUT_DIR, exist_ok=True)

# 1. Log in via requests to get session cookies
s = requests.Session()
r = s.get(f"{BASE_URL}/auth/login")
csrf = re.search(r'name="csrf-token"\s+content="([^"]+)"', r.text).group(1)
resp = s.post(
    f"{BASE_URL}/auth/login",
    json={"user": "rian", "password": "riansyah"},
    headers={"X-CSRF-TOKEN": csrf, "Accept": "application/json"}
)
print("Login status:", resp.status_code)
cookies = s.cookies.get_dict()

# 2. Launch Edge
subprocess.run(["taskkill", "/F", "/IM", "msedge.exe"], capture_output=True)
time.sleep(1)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
user_data_dir = r"C:\Users\A\Documents\edge_screenshot_profile"

proc = subprocess.Popen([
    edge_path,
    "--headless=new",
    "--remote-debugging-port=9222",
    f"--user-data-dir={user_data_dir}",
    "--hide-scrollbars",
    "about:blank"
])
time.sleep(2)

pages = [
    ("01-dashboard", "/"),
    ("02-account", "/account"),
    ("03-admin-overview", "/panel"),
    ("04-admin-themes", "/panel/themes"),
    ("05-admin-settings", "/panel/settings"),
    ("06-admin-extensions", "/panel/extensions"),
]

try:
    req = urllib.request.urlopen("http://127.0.0.1:9222/json")
    targets = json.loads(req.read().decode())
    target = [t for t in targets if t.get("type") == "page"][0]
    ws_url = target["webSocketDebuggerUrl"]
    
    ws = websocket.create_connection(ws_url, timeout=15)
    
    msg_id = 0
    def call(method, params=None):
        global msg_id
        msg_id += 1
        ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
        while True:
            res = json.loads(ws.recv())
            if res.get("id") == msg_id:
                return res.get("result", {})

    call("Network.enable")
    call("Page.enable")
    
    # --- Capture 00-login (Unauthenticated) ---
    print("Capturing 00-login desktop...")
    call("Network.clearBrowserCookies")
    call("Emulation.setDeviceMetricsOverride", {
        "width": 1440,
        "height": 900,
        "deviceScaleFactor": 1,
        "mobile": False
    })
    call("Page.navigate", {"url": f"{BASE_URL}/auth/login"})
    time.sleep(4)
    res = call("Page.captureScreenshot", {"format": "png"})
    with open(os.path.join(OUT_DIR, "00-login-desktop.png"), "wb") as f:
        f.write(base64.b64decode(res["data"]))

    print("Capturing 00-login mobile...")
    call("Emulation.setDeviceMetricsOverride", {
        "width": 390,
        "height": 844,
        "deviceScaleFactor": 1,
        "mobile": True
    })
    time.sleep(2)
    res = call("Page.captureScreenshot", {"format": "png"})
    with open(os.path.join(OUT_DIR, "00-login-mobile.png"), "wb") as f:
        f.write(base64.b64decode(res["data"]))

    # --- Authenticate with cookies for the rest ---
    for name, val in cookies.items():
        call("Network.setCookie", {
            "name": name,
            "value": val,
            "domain": "localhost",
            "path": "/"
        })

    # --- Capture each authenticated page ---
    for slug, path in pages:
        print(f"Capturing {slug} desktop...")
        call("Emulation.setDeviceMetricsOverride", {
            "width": 1440,
            "height": 900,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        call("Page.navigate", {"url": f"{BASE_URL}{path}"})
        time.sleep(4)
        res = call("Page.captureScreenshot", {"format": "png"})
        dest_desktop = os.path.join(OUT_DIR, f"{slug}-desktop.png")
        with open(dest_desktop, "wb") as f:
            f.write(base64.b64decode(res["data"]))

        # Also copy admin-themes as main preview
        if slug == "04-admin-themes":
            preview_dest = os.path.join(ROOT_DIR, "assets", "preview-gtake.png")
            with open(preview_dest, "wb") as f:
                f.write(base64.b64decode(res["data"]))

        print(f"Capturing {slug} mobile...")
        call("Emulation.setDeviceMetricsOverride", {
            "width": 390,
            "height": 844,
            "deviceScaleFactor": 1,
            "mobile": True
        })
        time.sleep(2)
        res = call("Page.captureScreenshot", {"format": "png"})
        dest_mobile = os.path.join(OUT_DIR, f"{slug}-mobile.png")
        with open(dest_mobile, "wb") as f:
            f.write(base64.b64decode(res["data"]))

    ws.close()
    print("All 14 real screenshots captured successfully!")
finally:
    proc.terminate()
