import sys
import paramiko

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

def run_ssh(cmd):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect("127.0.0.1", port=2222, username="rian", password="riansyah", timeout=10)
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        client.close()
        return out, err
    except Exception as e:
        return "", str(e)

if __name__ == "__main__":
    command = sys.argv[1] if len(sys.argv) > 1 else "uname -a; whoami; pwd"
    out, err = run_ssh(command)
    if out:
        print("=== STDOUT ===")
        print(out)
    if err:
        print("=== STDERR ===")
        print(err)
