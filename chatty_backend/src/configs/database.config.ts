import { BadRequestException } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD as string;
  const cluster = process.env.MONGO_CLUSTER;
  if (!password) throw new BadRequestException('Invalid Password');
  const encodedPassword = encodeURIComponent(password);
  const uri = `mongodb+srv://${username}:${encodedPassword}@${cluster}/?retryWrites=true&w=majority`;
  return { username, password, cluster, uri };
});
