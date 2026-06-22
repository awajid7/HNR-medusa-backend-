import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || ".*",
      adminCors: process.env.ADMIN_CORS || "https://hnr-medusa-backend-production.up.railway.app,http://localhost:9000,http://localhost:5173",
      authCors: process.env.AUTH_CORS || "https://hnr-medusa-backend-production.up.railway.app,http://localhost:9000,http://localhost:5173",
      // ✅ This is where the TypeScript compiler expects allowedHosts to live!
      allowedHosts: [
        "hnr-medusa-backend-production.up.railway.app",
        "localhost"
      ],
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: false
  }
})
