import { verifyGoogleJwt } from '../services/authService.js';

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = await verifyGoogleJwt(token);
    
    req.user = payload;
    next();
  } catch (err) {
    console.error('Error verifying Google token:', err);
    res.status(403).json({ error: 'Invalid token' });
  }
}