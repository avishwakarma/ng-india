export const configuration = () => ({
  environment: process.env.NODE_ENV,
  apiHost: process.env.API_HOST || "127.0.0.1",
  apiPort: parseInt(process.env.API_PORT || "4000", 10),
  authHost: process.env.AUTH_HOST || "127.0.0.1",
  authPort: parseInt(process.env.AUTH_PORT || "5000", 10),
  limit: parseInt(process.env.LIMIT || "15", 10),
  dbHost: process.env.LANDLORD_HOST || "127.0.0.1",
  dbPort: parseInt(process.env.LANDLORD_PORT || "5432", 10),
  dbUser: process.env.LANDLORD_USER || "postgres",
  dbPassword: process.env.LANDLORD_PASSWORD || "",
  dbName: process.env.LANDLORD_DATABASE || "",
  redisHost: process.env.REDIS_HOST || "127.0.0.1",
  redisPort: parseInt(process.env.REDIS_PORT || "6379", 10),
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  jwtPublicKey: process.env.JWT_PUBLIC_KEY,
  jwtExpiry: process.env.JWT_EXPIRY,
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY,
  jwtIssuer: process.env.JWT_ISSUER,
  jwtAlgorithm: process.env.JWT_ALGORITHM || "RS256",
  tenantDbHost: process.env.TENANT_HOST || "127.0.0.1",
  tenantDbPort: parseInt(process.env.TENANT_PORT || "5432", 10),
  tenantDbUser: process.env.TENANT_USER || "postgres",
  tenantDbPassword: process.env.TENANT_PASSWORD || "",
});
