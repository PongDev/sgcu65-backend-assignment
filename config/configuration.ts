export default () => ({
  port: parseInt(process.env.NESTJS_PORT, 10) || 3000,
});
