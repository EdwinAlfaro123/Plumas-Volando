import jsonwebtoken from 'jsonwebtoken';
import { config } from '../../config.js';

// Acepta tanto la cookie del sitio web como el encabezado Bearer de Expo/React Native.
export const validateAuthCookie = (allowedTypes = []) => (req, res, next) => {
  try {
    const authorization = req.headers.authorization || '';
    const bearerToken = authorization.startsWith('Bearer ')
      ? authorization.slice(7).trim()
      : null;
    const token = req.cookies?.authCookie || bearerToken;

    if (!token) {
      return res.status(401).json({ message: 'Autorización requerida' });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    if (allowedTypes.length && !allowedTypes.includes(decoded.userType)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    req.userId = decoded.id;
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Sesión inválida o expirada' });
    }
    console.error('Error de autenticación:', error);
    return res.status(500).json({ message: 'Error interno de autenticación' });
  }
};
