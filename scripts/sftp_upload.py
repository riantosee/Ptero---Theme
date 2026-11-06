import paramiko
import os

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("127.0.0.1", port=2222, username="rian", password="riansyah", timeout=10)

sftp = client.open_sftp()

root_dir = r"C:\Users\A\Documents\Codex\2026-10-29\files-pasted-by-the-user-mirai\outputs\mirainova-landing-page"

# 1. Upload package to /tmp
local_pkg = os.path.join(root_dir, "downloads", "gtake-ui-1.0.0.pteroext")
remote_pkg = "/tmp/gtake-ui-1.0.0.pteroext"
sftp.put(local_pkg, remote_pkg)
print("Uploaded package to /tmp/gtake-ui-1.0.0.pteroext")

# 2. Upload theme.css to /tmp/theme.css
local_css = os.path.join(root_dir, "themes", "gtake-ui", "pterodactyl-theme", "dist", "theme.css")
remote_css = "/tmp/theme.css"
sftp.put(local_css, remote_css)
print("Uploaded theme.css to /tmp/theme.css")

sftp.close()
client.close()
print("SFTP operations completed successfully!")
