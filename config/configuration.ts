export default () => ({
  port: parseInt(process.env.NESTJS_PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },
});
