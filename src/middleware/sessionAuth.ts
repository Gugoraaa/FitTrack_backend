import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware=(req: Request, res: Response, next: NextFunction):void=> {
  const publicPaths = ['/auth/login', '/auth/register','/auth/check-auth'];
  if (publicPaths.includes(req.path)) {
    return next(); 
  }
  
  const token = req.cookies.access_token;
  
  
  if (!token) {
    console.log("NO TOKEN")
    res.status(401).json({ message: 'No token provided' });
    return 
  }
  
  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'No token provided' });
    return 
  }
}

