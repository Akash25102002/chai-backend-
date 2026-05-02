import { asyncHandler } from 'express-async-handler';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Authorization token missing');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Authorization token missing');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500);
    throw new Error('JWT secret not configured');
  }

  const decoded = jwt.verify(token, secret);
  req.user = decoded;
  next();
});