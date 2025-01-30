import re
import subprocess
from pathlib import Path

def get_local_ip():
    """Get the local IP address of the machine."""
    result = subprocess.run(["ipconfig"], capture_output=True, text=True)
    ip_pattern = re.compile(r"IPv4 Address.*: (\d+\.\d+\.\d+\.\d+)")
    for line in result.stdout.splitlines():
        match = ip_pattern.search(line)
        if match:
            return match.group(1)
    return None

def update_hosts_file(ip_address, hostname):
    """Update the hosts file to map the given IP address to the specified hostname."""
    hosts_path = Path("C:/Windows/System32/drivers/etc/hosts")
    entry = f"{ip_address} {hostname}\n"
    
    # Read the current contents of the hosts file
    with open(hosts_path, 'r') as file:
        lines = file.readlines()
    
    # Check if the hostname already exists in the file
    hostname_exists = False
    for i, line in enumerate(lines):
        if hostname in line:
            lines[i] = entry
            hostname_exists = True
            break
    
    # If the hostname does not exist, add the new entry
    if not hostname_exists:
        lines.append(entry)
    
    # Write the updated contents back to the hosts file
    with open(hosts_path, 'w') as file:
        file.writelines(lines)
    
    print(f"Updated hosts file with: {entry.strip()}")

def main():
    local_ip = get_local_ip()
    if local_ip:
        local_ip = local_ip + ':9000'
        print(f"Local IP address found: {local_ip}")
        hostname = "mayabets.local"
        update_hosts_file(local_ip, hostname)
    else:
        print("Could not find local IP address.")

if __name__ == "__main__":
    main()
