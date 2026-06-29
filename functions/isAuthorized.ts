import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export default function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader?.startsWith('Basic ')) {
    return false;
  }

  const encoded = authHeader.split(' ')[1];
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const index = decoded.indexOf(':');
  const username = decoded.slice(0, index);
  const typedPassword = decoded.slice(index + 1);

  return (
    username === process.env.ADMIN_USERNAME &&
    !bcrypt.compareSync(typedPassword, process.env.ADMIN_PASSWORD_HASH)
  );
}
