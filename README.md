# H&R by Raza store backend

Medusa v2 backend and admin for the H&R by Raza online store. The storefront lives in
[HNR-clothing-storefront](https://github.com/awajid7/HNR-clothing-storefront).

## What is set up

- **Region:** Pakistan only, prices in PKR, tax-inclusive.
- **Payments** (`src/modules/manual-payments`):
  - `pp_cod_hnr`, cash on delivery collected by the courier.
  - `pp_wallet-transfer_hnr`, JazzCash, Easypaisa or bank transfer. The customer is told
    we will WhatsApp the account details after ordering.
  
  Both place the order as *authorized*. Capture the payment in the admin once the money
  has been received (COD remittance from the courier, or the transfer arriving).
- **Delivery:** from the Gulberg Studio stock location.
  - Standard delivery across Pakistan, PKR 300, free from PKR 15,000.
  - Express delivery in Lahore, PKR 500.
  - Pickup from the Gulberg Studio, free.
  
  Couriers (PostEx, Leopards, TCS) are booked by hand from their portals for now; the
  options use Medusa's manual fulfillment provider.
- **Catalog:** `yarn seed` loads 17 products: the 13 current LAAM listings and the 4
  pieces on hnrbyraza.com, with their photos in `static/catalog`. Stock is not tracked
  (`manage_inventory: false`) because pieces are cut to order.
- **Redis** is used for events, cache, locking and workflows when `REDIS_URL` is set.
- **Files:** admin uploads go to local disk, or to S3/R2 when `S3_BUCKET` is set.

## Run locally

Requires Node 20+, Postgres and Redis.

```bash
cp .env.template .env
createdb medusa_hnr
yarn install
npx medusa db:migrate
yarn seed                      # prints the storefront publishable key
npx medusa user -e you@example.com -p <password>
yarn dev                       # API on :9000, admin on :9000/app
```

## Deploy on Railway

1. In Railway, create a project and add **Postgres** and **Redis**.
2. Add a service from this GitHub repo. `railway.json` sets the build and start commands
   (build, then migrate and start from `.medusa/server`).
3. Under the service's **Networking**, generate a domain (for example
   `hnr-backend.up.railway.app`).
4. Set the service variables:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
   | `REDIS_URL` | `${{Redis.REDIS_URL}}` |
   | `MEDUSA_BACKEND_URL` | `https://<backend domain>` |
   | `STORE_CORS` | `https://<storefront domain>` |
   | `ADMIN_CORS` | `https://<backend domain>` |
   | `AUTH_CORS` | `https://<backend domain>,https://<storefront domain>` |
   | `JWT_SECRET`, `COOKIE_SECRET` | long random strings |
   | `NODE_ENV` | `production` |

5. After the first successful deploy, seed the store and create an admin user from the
   service shell (`railway ssh`):

   ```bash
   cd .medusa/server
   npx medusa exec ./src/scripts/seed.js
   npx medusa user -e <email> -p <password>
   ```

   The seed log prints the publishable API key the storefront needs. It is also in the
   admin under Settings → Publishable API Keys.

## Next steps

- Courier integration (PostEx or Leopards API) as a fulfillment provider, to book
  shipments and print airway bills from the admin.
- Online JazzCash / Easypaisa checkout once H&R has merchant accounts.
- Order emails or WhatsApp notifications.
- Cloudflare R2 for product photos uploaded in the admin.
