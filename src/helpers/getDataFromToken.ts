import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const getDataFromToken = (request: NextRequest): string | null => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decodedToken.id;
  } catch (error: any) {
    // This will catch expired tokens or invalid tokens
    console.error('JWT verification error:', error.message);
    return null;
  }
};
