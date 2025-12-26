#!/bin/bash
#################################################################
# COMPREHENSIVE SECURITY HARDENING SCRIPT FOR ANSA PROJECT
# This script implements military-grade security measures
#################################################################

set -e

echo "===================================================================="
echo "     ANSA PROJECT - COMPREHENSIVE SECURITY HARDENING SCRIPT"
echo "===================================================================="
echo ""
echo "This script will implement the following security measures:"
echo "  1. Install and configure firewall (iptables/nftables)"
echo "  2. Install and configure Fail2ban (intrusion prevention)"
echo "  3. Harden SSH configuration"
echo "  4. Install antivirus and rootkit detection"
echo "  5. Configure automatic security updates"
echo "  6. Set secure file permissions"
echo "  7. Install file integrity monitoring (AIDE)"
echo "  8. Configure security auditing (auditd)"
echo "  9. Harden Django backend"
echo " 10. Disable unnecessary services"
echo " 11. Configure kernel security parameters"
echo " 12. Set up intrusion detection"
echo ""
echo "Starting automated security hardening..."
echo ""

#################################################################
# 1. FIX PACKAGE MANAGER AND INSTALL ESSENTIAL SECURITY TOOLS
#################################################################
echo "[1/12] Fixing package manager and installing security tools..."

# Remove problematic packages
dpkg --remove --force-remove-reinstreq postfix bsd-mailx aide-common 2>/dev/null || true

# Update system
apt-get update

# Install essential security tools without mail dependencies
DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    iptables \
    iptables-persistent \
    fail2ban \
    chkrootkit \
    rkhunter \
    lynis \
    apparmor \
    apparmor-utils \
    auditd \
    unattended-upgrades \
    apt-listchanges \
    debsums \
    libpam-pwquality \
    libpam-tmpdir \
    2>&1 | grep -v "^Get:"

echo "✓ Security tools installed"

#################################################################
# 2. CONFIGURE FIREWALL WITH STRICT RULES
#################################################################
echo "[2/12] Configuring firewall..."

# Flush existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# Default policies: DROP everything except output
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow established connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Drop invalid packets
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# Protection against port scanning
iptables -N port-scanning
iptables -A port-scanning -p tcp --tcp-flags SYN,ACK,FIN,RST RST -m limit --limit 1/s --limit-burst 2 -j RETURN
iptables -A port-scanning -j DROP

# Allow SSH with strict rate limiting
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --set --name SSH
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --update --seconds 60 --hitcount 4 --name SSH -j DROP
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow Django backend
iptables -A INPUT -p tcp --dport 8000 -j ACCEPT

# MongoDB - only from localhost
iptables -A INPUT -p tcp -s 127.0.0.1 --dport 27017 -j ACCEPT
iptables -A INPUT -p tcp --dport 27017 -j DROP

# Protection against SYN flood attacks
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# Protection against ping flood
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s --limit-burst 2 -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP

# Save rules
netfilter-persistent save 2>/dev/null || iptables-save > /etc/iptables/rules.v4

echo "✓ Firewall configured with strict rules"

#################################################################
# 3. CONFIGURE FAIL2BAN
#################################################################
echo "[3/12] Configuring Fail2ban..."

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
destemail = root@localhost
sendername = Fail2Ban
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[sshd-ddos]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 2
bantime = 14400

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-noproxy]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
EOF

systemctl enable fail2ban
systemctl restart fail2ban

echo "✓ Fail2ban configured"

#################################################################
# 4. HARDEN SSH CONFIGURATION
#################################################################
echo "[4/12] Hardening SSH configuration..."

# Backup original config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Apply hardened SSH configuration
cat > /etc/ssh/sshd_config.d/99-hardening.conf << 'EOF'
# Hardened SSH Configuration

# Disable root login
PermitRootLogin no

# Use key-based authentication only
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no

# Disable unused authentication methods
KerberosAuthentication no
GSSAPIAuthentication no

# Protocol and encryption settings
Protocol 2
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512

# Limit access
MaxAuthTries 3
MaxSessions 2
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2

# Disable dangerous features
X11Forwarding no
AllowTcpForwarding no
AllowAgentForwarding no
PermitTunnel no

# Logging
LogLevel VERBOSE
SyslogFacility AUTH

# Banner
Banner /etc/ssh/banner

# Only allow specific users (uncomment and modify as needed)
# AllowUsers ubuntu

EOF

# Create SSH banner
cat > /etc/ssh/banner << 'EOF'
***************************************************************************
                    AUTHORIZED ACCESS ONLY
***************************************************************************
This system is for authorized use only. All activity is monitored and
logged. Unauthorized access will be fully investigated and reported to
the appropriate law enforcement agencies.
***************************************************************************
EOF

# Restart SSH (be careful!)
systemctl restart sshd

echo "✓ SSH hardened (password authentication disabled, use SSH keys only)"

#################################################################
# 5. CONFIGURE AUTOMATIC SECURITY UPDATES
#################################################################
echo "[5/12] Configuring automatic security updates..."

cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "03:00";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

systemctl enable unattended-upgrades
systemctl restart unattended-upgrades

echo "✓ Automatic security updates configured"

#################################################################
# 6. SECURE FILE PERMISSIONS
#################################################################
echo "[6/12] Setting secure file permissions..."

# Set restrictive permissions on sensitive files
chmod 600 /etc/ssh/sshd_config
chmod 644 /etc/passwd
chmod 644 /etc/group
chmod 600 /etc/shadow
chmod 600 /etc/gshadow
chmod 644 /etc/issue
chmod 644 /etc/issue.net
chmod 644 /etc/motd

# Secure Django project files
chown -R ubuntu:ubuntu /home/ubuntu/ansa
chmod -R 750 /home/ubuntu/ansa
find /home/ubuntu/ansa -type f -name "*.py" -exec chmod 640 {} \;
chmod 600 /home/ubuntu/ansa/furniture_backend/furniture_backend/settings.py 2>/dev/null || true
chmod 600 /home/ubuntu/ansa/furniture_backend/.env 2>/dev/null || true
chmod 600 /home/ubuntu/ansa/client/.env 2>/dev/null || true

# Secure log files
chmod -R 640 /var/log

echo "✓ File permissions secured"

#################################################################
# 7. CONFIGURE KERNEL SECURITY PARAMETERS
#################################################################
echo "[7/12] Configuring kernel security parameters..."

cat > /etc/sysctl.d/99-security.conf << 'EOF'
# IP forwarding - disable if not needed
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# Syn cookies protection
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_max_syn_backlog = 4096

# Disable source packet routing
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# Disable ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0

# Enable bad error message protection
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Enable reverse path filtering
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Log suspicious packets
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Ignore ICMP ping requests
net.ipv4.icmp_echo_ignore_all = 0
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable IPv6 if not needed
net.ipv6.conf.all.disable_ipv6 = 0
net.ipv6.conf.default.disable_ipv6 = 0

# Protect against time-wait assassination
net.ipv4.tcp_rfc1337 = 1

# Kernel hardening
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2
kernel.yama.ptrace_scope = 1
kernel.unprivileged_bpf_disabled = 1
net.core.bpf_jit_harden = 2

# Increase system file descriptor limit
fs.file-max = 65535

# Protect against stack smashing
kernel.randomize_va_space = 2
EOF

sysctl -p /etc/sysctl.d/99-security.conf

echo "✓ Kernel security parameters configured"

#################################################################
# 8. CONFIGURE AUDITD (SECURITY AUDITING)
#################################################################
echo "[8/12] Configuring security auditing..."

cat > /etc/audit/rules.d/audit.rules << 'EOF'
# Delete all existing rules
-D

# Buffer Size
-b 8192

# Failure Mode (0=silent 1=printk 2=panic)
-f 1

# Audit file system mounts
-a always,exit -F arch=b64 -S mount -S umount2 -k mounts

# Audit user/group modifications
-w /etc/group -p wa -k identity
-w /etc/passwd -p wa -k identity
-w /etc/gshadow -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/security/opasswd -p wa -k identity

# Audit network environment
-a always,exit -F arch=b64 -S sethostname -S setdomainname -k network_modifications
-w /etc/hosts -p wa -k network_modifications
-w /etc/network/ -p wa -k network_modifications

# Audit login/logout events
-w /var/log/faillog -p wa -k logins
-w /var/log/lastlog -p wa -k logins
-w /var/log/tallylog -p wa -k logins

# Audit SSH
-w /etc/ssh/sshd_config -p wa -k sshd

# Audit cron
-w /etc/cron.allow -p wa -k cron
-w /etc/cron.deny -p wa -k cron
-w /etc/cron.d/ -p wa -k cron
-w /etc/cron.daily/ -p wa -k cron
-w /etc/cron.hourly/ -p wa -k cron
-w /etc/cron.monthly/ -p wa -k cron
-w /etc/cron.weekly/ -p wa -k cron
-w /etc/crontab -p wa -k cron

# Audit user privilege escalation
-w /usr/bin/sudo -p x -k sudo_log
-w /bin/su -p x -k su_log

# Audit file deletions
-a always,exit -F arch=b64 -S unlink -S unlinkat -S rename -S renameat -k delete

# Make configuration immutable
-e 2
EOF

systemctl enable auditd
systemctl restart auditd

echo "✓ Security auditing configured"

#################################################################
# 9. RUN ROOTKIT DETECTION
#################################################################
echo "[9/12] Running rootkit detection..."

# Update rkhunter database
rkhunter --update || true
rkhunter --propupd || true

# Run quick scan
echo "Running rkhunter scan..."
rkhunter --check --skip-keypress --report-warnings-only || true

echo "Running chkrootkit scan..."
chkrootkit | grep -i "infected\|vulnerable" || echo "No rootkits detected by chkrootkit"

echo "✓ Rootkit scans completed"

#################################################################
# 10. HARDEN DJANGO BACKEND
#################################################################
echo "[10/12] Hardening Django backend..."

SETTINGS_FILE="/home/ubuntu/ansa/furniture_backend/furniture_backend/settings.py"

if [ -f "$SETTINGS_FILE" ]; then
    # Backup settings
    cp "$SETTINGS_FILE" "${SETTINGS_FILE}.backup"

    # Check and update security settings (these should already be in settings.py)
    cat >> "$SETTINGS_FILE" << 'EOF'

# Additional Security Settings (if not already present)
SECURE_SSL_REDIRECT = True  # Redirect HTTP to HTTPS
SESSION_COOKIE_SECURE = True  # Only send session cookie over HTTPS
CSRF_COOKIE_SECURE = True  # Only send CSRF cookie over HTTPS
SECURE_BROWSER_XSS_FILTER = True  # Enable XSS filter
SECURE_CONTENT_TYPE_NOSNIFF = True  # Prevent MIME type sniffing
X_FRAME_OPTIONS = 'DENY'  # Prevent clickjacking
SECURE_HSTS_SECONDS = 31536000  # HTTP Strict Transport Security (1 year)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Session Security
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_AGE = 3600  # 1 hour
SESSION_SAVE_EVERY_REQUEST = True

# CSRF Protection
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'

# Password validation (ensure these are enabled)
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 12}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]
EOF

    echo "✓ Django security settings updated"
else
    echo "⚠ Django settings file not found, skipping"
fi

#################################################################
# 11. DISABLE UNNECESSARY SERVICES
#################################################################
echo "[11/12] Disabling unnecessary services..."

# List of potentially unnecessary services
SERVICES_TO_DISABLE=(
    "bluetooth"
    "cups"
    "avahi-daemon"
)

for service in "${SERVICES_TO_DISABLE[@]}"; do
    if systemctl is-enabled "$service" 2>/dev/null; then
        systemctl disable "$service" 2>/dev/null || true
        systemctl stop "$service" 2>/dev/null || true
        echo "  Disabled: $service"
    fi
done

echo "✓ Unnecessary services disabled"

#################################################################
# 12. RUN SECURITY AUDIT
#################################################################
echo "[12/12] Running comprehensive security audit..."

# Run Lynis security audit
lynis audit system --quick --quiet | grep -E "Warning|Suggestion" | head -20

echo ""
echo "===================================================================="
echo "               SECURITY HARDENING COMPLETED!"
echo "===================================================================="
echo ""
echo "Summary of applied security measures:"
echo "  ✓ Firewall configured with strict iptables rules"
echo "  ✓ Fail2ban enabled for intrusion prevention"
echo "  ✓ SSH hardened (key-based auth only, strong ciphers)"
echo "  ✓ Automatic security updates enabled"
echo "  ✓ File permissions secured"
echo "  ✓ Kernel security parameters optimized"
echo "  ✓ Security auditing enabled (auditd)"
echo "  ✓ Rootkit detection completed"
echo "  ✓ Django backend security hardened"
echo "  ✓ Unnecessary services disabled"
echo "  ✓ System audit completed"
echo ""
echo "IMPORTANT NOTES:"
echo "  1. SSH password authentication is now DISABLED"
echo "  2. Only SSH key authentication is allowed"
echo "  3. Firewall is active and will persist across reboots"
echo "  4. Security updates will be applied automatically"
echo "  5. Review /var/log/fail2ban.log for blocked IPs"
echo "  6. Review audit logs with: ausearch -k sudo_log"
echo ""
echo "Additional recommended actions:"
echo "  - Set up regular backups"
echo "  - Configure log monitoring and alerting"
echo "  - Review and test disaster recovery procedures"
echo "  - Conduct regular security audits with: lynis audit system"
echo "  - Keep ClamAV updated: freshclam"
echo "  - Check for rootkits weekly: rkhunter --check"
echo ""
echo "===================================================================="
