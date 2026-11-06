import requests
import re
import json

s = requests.Session()
r = s.get("http://localhost:8090/auth/login")
csrf = re.search(r'name="csrf-token"\s+content="([^"]+)"', r.text).group(1)
print("CSRF:", csrf)

resp = s.post(
    "http://localhost:8090/auth/login",
    json={"user": "rian", "password": "riansyah"},
    headers={"X-CSRF-TOKEN": csrf, "Accept": "application/json"}
)
print("Login status:", resp.status_code, resp.text)

# Check access to themes
themes = s.get("http://localhost:8090/panel/themes")
print("Themes status:", themes.status_code)
