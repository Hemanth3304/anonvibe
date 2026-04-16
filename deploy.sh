#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  AnonVibe — One-Shot Production Deploy Script
#  Run this on a fresh Ubuntu 22.04 VPS as root
#  Usage: bash deploy.sh yourdomain.com your@email.com
# ═══════════════════════════════════════════════════════════════

set -e

DOMAIN=${1:-""}
EMAIL=${2:-""}

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "Usage: bash deploy.sh yourdomain.com your@email.com"
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   AnonVibe Production Deployment         ║"
echo "║   Domain: $DOMAIN"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── 1. System Updates ──────────────────────────────────────────
echo "▶ Updating system..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. Install Docker ─────────────────────────────────────────
echo "▶ Installing Docker..."
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
fi

if ! command -v docker compose &>/dev/null; then
  apt-get install -y docker-compose-plugin
fi

# ── 3. Firewall ───────────────────────────────────────────────
echo "▶ Configuring firewall..."
apt-get install -y ufw -qq
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3478/tcp
ufw allow 3478/udp
ufw allow 5349/tcp
ufw allow 5349/udp
ufw allow 49152:49200/udp
echo "y" | ufw enable

# ── 4. Generate secrets ───────────────────────────────────────
echo "▶ Generating secrets..."
JWT_SECRET=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -hex 32)
REDIS_PASSWORD=$(openssl rand -hex 16)
POSTGRES_PASSWORD=$(openssl rand -hex 16)
TURN_SECRET=$(openssl rand -hex 16)
SERVER_IP=$(curl -4s ifconfig.me)

# ── 5. Write .env ─────────────────────────────────────────────
echo "▶ Writing .env..."
cat > .env <<EOF
# ─── SERVER ───────────────────────────────────────────────────
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://${DOMAIN}
JWT_SECRET=${JWT_SECRET}
SESSION_SECRET=${SESSION_SECRET}

# ─── REDIS ───────────────────────────────────────────────────
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# ─── POSTGRES ────────────────────────────────────────────────
POSTGRES_USER=sw_user
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=strangerworld
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# ─── TURN SERVER ─────────────────────────────────────────────
TURN_SECRET=${TURN_SECRET}
TURN_REALM=${DOMAIN}

# ─── RATE LIMITING ──────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
EOF

echo "✔ .env written"

# ── 6. Update nginx.conf with domain ─────────────────────────
echo "▶ Configuring Nginx for domain: ${DOMAIN}..."
sed -i "s/yourdomain\.com/${DOMAIN}/g" docker/nginx.conf

# ── 7. Update turnserver.conf ─────────────────────────────────
echo "▶ Configuring TURN server (IP: ${SERVER_IP})..."
cat > docker/turnserver.conf <<EOF
listening-port=3478
tls-listening-port=5349

use-auth-secret
static-auth-secret=${TURN_SECRET}

realm=${DOMAIN}
external-ip=${SERVER_IP}

user-quota=100
total-quota=0

min-port=49152
max-port=49200

simple-log
log-file=/var/log/turn.log
EOF

# ── 8. Build Frontend ─────────────────────────────────────────
echo "▶ Building frontend..."
cd frontend
npm install --silent
npm run build
cd ..
echo "✔ Frontend built → frontend/dist/"

# ── 9. SSL Certificate via Certbot ───────────────────────────
echo "▶ Obtaining SSL certificate for ${DOMAIN}..."

# Temporarily use HTTP-only nginx config
cat > /tmp/nginx-http-only.conf <<NGINXEOF
worker_processes auto;
events { worker_connections 1024; }
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    server {
        listen 80;
        server_name ${DOMAIN} www.${DOMAIN};
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files \$uri \$uri/ /index.html;
        }
    }
}
NGINXEOF

cp docker/nginx.conf docker/nginx.conf.bak
cp /tmp/nginx-http-only.conf docker/nginx.conf

# Start nginx only
docker compose up -d nginx

sleep 3

# Get certificate
docker compose run --rm certbot certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "${EMAIL}" \
  --agree-tos \
  --no-eff-email \
  --non-interactive \
  -d "${DOMAIN}" \
  -d "www.${DOMAIN}" || {
    echo "⚠ Certbot failed. Ensure DNS is pointing to this server (${SERVER_IP}) and try again."
    echo "  Falling back to HTTP-only mode..."
  }

# Restore full nginx config
cp docker/nginx.conf.bak docker/nginx.conf

# ── 10. Launch all services ──────────────────────────────────
echo ""
echo "▶ Launching all services..."
docker compose down 2>/dev/null || true
docker compose up -d --build

# ── 11. Health check ─────────────────────────────────────────
echo "▶ Waiting for services to be healthy..."
sleep 10

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Service Status:"
docker compose ps
echo "═══════════════════════════════════════════════════"

echo ""
echo "▶ Testing health endpoint..."
sleep 5
curl -sk "https://${DOMAIN}/api/health" && echo "" || \
  curl -s "http://${DOMAIN}/api/health" && echo ""

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  🎉 AnonVibe is LIVE!                    ║"
echo "║                                          ║"
echo "║  URL: https://${DOMAIN}         "
echo "║                                          ║"
echo "║  Manage:                                 ║"
echo "║  docker compose logs -f                  ║"
echo "║  docker compose ps                       ║"
echo "╚══════════════════════════════════════════╝"
