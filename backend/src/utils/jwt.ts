import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_taskflow';
  return jwt.sign({ userId }, secret, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_taskflow';
  return jwt.verify(token, secret) as TokenPayload;
};
