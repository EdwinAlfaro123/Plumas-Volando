import jsonwebtoken from 'jsonwebtoken';
import { config } from '../../config.js';

// Devuelve los tokens candidatos de la petición.
// El Bearer va primero: es lo que el cliente envía de forma explícita.
// La cookie puede venir de una sesión anterior (otro usuario, otro tipo de cuenta
// o un secreto viejo) y antes ganaba siempre sobre el Bearer, lo que provocaba 401.
const getCandidateTokens = (req) => {
  const authorization = req.headers.authorization || '';
  const bearerToken = authorization.startsWith('Bearer ')
    ? authorization.slice(7).trim()
    : null;
  const cookieToken = req.cookies?.authCookie || null;

  return [bearerToken, cookieToken].filter(Boolean);
};

// Acepta tanto el encabezado Bearer (web admin y Expo/React Native) como la cookie del sitio web.
export const validateAuthCookie = (allowedTypes = []) => (req, res, next) => {
  try {
    const tokens = getCandidateTokens(req);

    if (tokens.length === 0) {
      return res.status(401).json({ message: 'Autorización requerida' });
    }

    let decoded = null;
    let hadValidTokenOfOtherType = false;

    for (const token of tokens) {
      try {
        const payload = jsonwebtoken.verify(token, config.JWT.secret);

        if (!allowedTypes.length || allowedTypes.includes(payload.userType)) {
          decoded = payload;
          break;
        }

        hadValidTokenOfOtherType = true;
      } catch (verifyError) {
        if (
          verifyError.name !== 'JsonWebTokenError' &&
          verifyError.name !== 'TokenExpiredError' &&
          verifyError.name !== 'NotBeforeError'
        ) {
          throw verifyError;
        }
        // Token inválido o vencido: se prueba con el siguiente candidato.
      }
    }

    if (!decoded) {
      if (hadValidTokenOfOtherType) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
      return res.status(401).json({ message: 'Sesión inválida o expirada' });
    }

    req.userId = decoded.id;
    req.user = decoded;
    return next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(500).json({ message: 'Error interno de autenticación' });
  }
};