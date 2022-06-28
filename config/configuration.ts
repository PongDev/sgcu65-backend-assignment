export default () => ({
  port: parseInt(process.env.NESTJS_PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },
  swagger: {
    enable: process.env.ENABLE_SWAGGER_API.toLowerCase().trim() === 'true',
    prefix: process.env.SWAGGER_PREFIX_PATH,
  },
});
