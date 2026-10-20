# Free hosting on an Oracle Cloud "Always Free" server

Everything (Postgres, Redis, Medusa backend + admin, the Next.js storefront and HTTPS)
runs on one free Oracle Cloud Arm server with Docker. Nothing sleeps, there are no
cold starts, and commercial use is allowed.

What you end up with:

- `https://shop.hnrbyraza.com`: the store
- `https://api.hnrbyraza.com/app`: the Medusa admin

## 1. Create the Oracle Cloud account

1. Sign up at <https://signup.cloud.oracle.com>. A debit or credit card is needed for
   verification; Always Free resources are not charged.
2. Pick a **home region** close to Pakistan (for example India West (Mumbai) or UAE
   East (Dubai)). It cannot be changed later.
3. Recommended: upgrade the account to **Pay As You Go** (Billing → Upgrade). Always Free
   resources stay free, and Oracle no longer reclaims "idle" free servers, which a
   small shop can look like. Set a budget alert of $1 under Billing → Budgets.

## 2. Create the server

Compute → Instances → Create instance:

- Image: **Canonical Ubuntu 24.04**
- Shape: **VM.Standard.A1.Flex** (Ampere, Arm), **2 OCPU, 12 GB memory** (Always Free)
- Networking: keep "Assign a public IPv4 address"
- SSH keys: upload your public key (or let Oracle generate one and download it)

If you get "Out of capacity", try another availability domain or try again later.

Note the server's **public IP**.

## 3. Open ports 80 and 443

1. Instance → Primary VNIC → Subnet → Security List → **Add ingress rules**:
   source `0.0.0.0/0`, TCP, destination ports `80,443`.
2. On the server (`ssh ubuntu@<public-ip>`), Oracle's Ubuntu image also has a local
   firewall:

   ```bash
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
   sudo netfilter-persistent save
   ```

## 4. Install Docker and get the code

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu && newgrp docker

cd ~
git clone https://github.com/awajid7/HNR-medusa-backend-.git
# The storefront repo is private: use a GitHub fine-grained token with read access
git clone https://<token>@github.com/awajid7/HNR-clothing-storefront.git
```

## 5. Point the domains at the server

Where hnrbyraza.com's DNS is managed, add two **A records** pointing at the public IP:
`api` and `shop`.

No domain yet? Use free sslip.io names instead, e.g. for IP `129.151.1.2`:
`api.129-151-1-2.sslip.io` and `shop.129-151-1-2.sslip.io`.

## 6. Configure and start the backend

```bash
cd ~/HNR-medusa-backend-/deploy
cp .env.example .env
nano .env        # set API_DOMAIN, SHOP_DOMAIN and the four secrets (openssl rand -hex 32)

docker compose up -d --build postgres redis backend caddy
docker compose logs -f backend      # wait for "Server is ready on port: 9000", then Ctrl+C

# Load the products, delivery options and payment methods (once)
docker compose exec backend npx medusa exec ./src/scripts/seed.js
# Create your admin login
docker compose exec backend npx medusa user -e you@example.com -p '<password>'
```

The seed prints `Publishable API key for the storefront: pk_...`. Put it in `.env` as
`PUBLISHABLE_KEY`.

Check `https://<API_DOMAIN>/health` shows `OK` and log in at `https://<API_DOMAIN>/app`.

## 7. Build and start the storefront

```bash
echo "COMPOSE_PROFILES=storefront" >> .env
docker compose up -d --build storefront
```

The store is live at `https://<SHOP_DOMAIN>`.

## 8. Backups

```bash
crontab -e
# add:
0 3 * * * /home/ubuntu/HNR-medusa-backend-/deploy/backup.sh
```

Dumps are kept for 14 days in `deploy/backups/`. Copy them off the server now and then
(for example to Google Drive).

## Updating

```bash
cd ~/HNR-medusa-backend- && git pull
cd ~/HNR-clothing-storefront && git pull
cd ~/HNR-medusa-backend-/deploy && docker compose up -d --build
```

The storefront prerenders product pages at build time; new products added in the admin
appear on their own, but rebuild the storefront after big catalog changes.
