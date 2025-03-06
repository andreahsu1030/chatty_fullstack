import { registerAs } from '@nestjs/config';

export default registerAs('secret', () => {
  const jwt = String(process.env.JWT_SECRET);
  return { jwt };
});
