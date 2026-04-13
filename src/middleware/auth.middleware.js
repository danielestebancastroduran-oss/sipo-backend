import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('⚠️ JWT_SECRET no está configurado en las variables de entorno');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor'
      });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
};

export const arquitectoOnly = (req, res, next) => {
  if (!req.user || !['arquitecto', 'admin'].includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de arquitecto o administrador'
    });
  }
  next();
};

export const ingenieroOnly = (req, res, next) => {
  if (!req.user || !['ingeniero', 'arquitecto', 'admin'].includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de ingeniero, arquitecto o administrador'
    });
  }
  next();
};
