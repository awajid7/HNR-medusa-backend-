"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || "development", process.cwd());
const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
const redisUrl = process.env.REDIS_URL;
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
    : [];
exports.default = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        redisUrl,
        workerMode: process.env.MEDUSA_WORKER_MODE,
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
                            options: { backend_url: `${backendUrl}/static` },
                        },
                    ],
            },
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUU7QUFFakUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBRTdELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksdUJBQXVCLENBQUE7QUFDNUUsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUE7QUFFdEMsMEVBQTBFO0FBQzFFLDREQUE0RDtBQUM1RCxNQUFNLFlBQVksR0FBRyxRQUFRO0lBQzNCLENBQUMsQ0FBQztRQUNFO1lBQ0UsT0FBTyxFQUFFLGtDQUFrQztZQUMzQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUU7U0FDdEI7UUFDRDtZQUNFLE9BQU8sRUFBRSw4QkFBOEI7WUFDdkMsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFO1NBQ3RCO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsd0NBQXdDO1lBQ2pELE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFO1NBQ2pDO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsMEJBQTBCO1lBQ25DLE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLGdDQUFnQzt3QkFDekMsRUFBRSxFQUFFLGVBQWU7d0JBQ25CLFVBQVUsRUFBRSxJQUFJO3dCQUNoQixPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUU7cUJBQ3RCO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0lBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtBQUVOLGtCQUFlLElBQUEsb0JBQVksRUFBQztJQUMxQixhQUFhLEVBQUU7UUFDYixXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZO1FBQ3JDLFFBQVE7UUFDUixVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFJWDtRQUNiLElBQUksRUFBRTtZQUNKLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSx1QkFBdUI7WUFDNUQsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLDZDQUE2QztZQUNsRixRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksbUVBQW1FO1lBQ3RHLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxhQUFhO1lBQ2xELFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxhQUFhO1NBQ3pEO0tBQ0Y7SUFDRCxLQUFLLEVBQUU7UUFDTCxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsS0FBSyxNQUFNO1FBQ3BELFVBQVU7S0FDWDtJQUNELE9BQU8sRUFBRTtRQUNQLEdBQUcsWUFBWTtRQUNmO1lBQ0UsT0FBTyxFQUFFLDBCQUEwQjtZQUNuQyxPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFO29CQUNUO3dCQUNFLDREQUE0RDt3QkFDNUQsT0FBTyxFQUFFLCtCQUErQjt3QkFDeEMsRUFBRSxFQUFFLEtBQUs7cUJBQ1Y7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsdUJBQXVCO1lBQ2hDLE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTO29CQUM5QixDQUFDLENBQUM7d0JBQ0U7NEJBQ0UsT0FBTyxFQUFFLDBCQUEwQjs0QkFDbkMsRUFBRSxFQUFFLElBQUk7NEJBQ1IsT0FBTyxFQUFFO2dDQUNQLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7Z0NBQ2pDLGFBQWEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQjtnQ0FDM0MsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0I7Z0NBQ25ELE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxNQUFNO2dDQUN2QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTO2dDQUM3QixRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXOzZCQUNsQzt5QkFDRjtxQkFDRjtvQkFDSCxDQUFDLENBQUM7d0JBQ0U7NEJBQ0UsT0FBTyxFQUFFLDZCQUE2Qjs0QkFDdEMsRUFBRSxFQUFFLE9BQU87NEJBQ1gsT0FBTyxFQUFFLEVBQUUsV0FBVyxFQUFFLEdBQUcsVUFBVSxTQUFTLEVBQUU7eUJBQ2pEO3FCQUNGO2FBQ047U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFBIn0=