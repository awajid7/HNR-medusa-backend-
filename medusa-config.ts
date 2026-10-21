import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const redisUrl = process.env.REDIS_URL

// With Redis available (Railway), use it for events, caching, locking and
// workflows so the server and worker instances share state.
const redisModules = redisUrl
  ? [
      {
        resolve: "@medusajs/medusa/event-bus-redis",
        options: { redisUrl },
      },
      {
        resolve: "@medusajs/medusa/cache-redis",
        options: { redisUrl },
      },
      {
        resolve: "@medusajs/medusa/workflow-engine-redis",
        options: { redis: { redisUrl } },
      },
      {
        resolve: "@medusajs/medusa/locking",
        options: {
          providers: [
            {
              resolve: "@medusajs/medusa/locking-redis",
              id: "locking-redis",
              is_default: true,
              options: { redisUrl },
            },
          ],
        },
      },
    ]
  : []

// Order emails go through Resend when RESEND_API_KEY is set; otherwise they
// are only logged. The local provider keeps the admin's notification feed.
const notificationProviders = [
  {
    resolve: "@medusajs/medusa/notification-local",
    id: "local",
    options: {
      channels: process.env.RESEND_API_KEY ? ["feed"] : ["feed", "email"],
    },
  },
  ...(process.env.RESEND_API_KEY
    ? [
        {
          resolve: "./src/modules/resend",
          id: "resend",
          options: {
            channels: ["email"],
            api_key: process.env.RESEND_API_KEY,
            from: process.env.RESEND_FROM || "H&R by Raza <order@hnrbyraza.com>",
            reply_to: process.env.ORDER_NOTIFY_EMAIL || "sales@hnrbyraza.com",
          },
        },
      ]
    : []),
]

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // Medusa uses SSL for the database in production; a Postgres on the same
    // server (deploy/docker-compose.yml) doesn't need it.
    databaseDriverOptions:
      process.env.DATABASE_SSL === "false"
        ? { connection: { ssl: false } }
        : undefined,
    redisUrl,
    workerMode: process.env.MEDUSA_WORKER_MODE as
      | "shared"
      | "worker"
      | "server"
      | undefined,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000,http://localhost:5173",
      authCors: process.env.AUTH_CORS || "http://localhost:9000,http://localhost:5173,http://localhost:8000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl,
  },
  modules: [
    ...redisModules,
    {
      // Editable storefront text and fonts (admin: Site content)
      resolve: "./src/modules/site-content",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            // Cash on delivery and JazzCash / Easypaisa / bank transfer
            resolve: "./src/modules/manual-payments",
            id: "hnr",
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: { providers: notificationProviders },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: process.env.S3_BUCKET
          ? [
              {
                resolve: "@medusajs/medusa/file-s3",
                id: "s3",
                options: {
                  file_url: process.env.S3_FILE_URL,
                  access_key_id: process.env.S3_ACCESS_KEY_ID,
                  secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                  region: process.env.S3_REGION || "auto",
                  bucket: process.env.S3_BUCKET,
                  endpoint: process.env.S3_ENDPOINT,
                },
              },
            ]
          : [
              {
                resolve: "@medusajs/medusa/file-local",
                id: "local",
                options: {
                  // Kept apart from static/catalog so a volume can hold uploads
                  upload_dir: "static/uploads",
                  backend_url: `${backendUrl}/static/uploads`,
                },
              },
            ],
      },
    },
  ],
})
