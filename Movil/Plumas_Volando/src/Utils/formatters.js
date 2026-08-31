// Formatea un número a moneda (ej: $12.00)
export const formatCurrency = (amount) => {
  return `$${Number(amount).toFixed(2)}`;
};

// Formatea una fecha ISO a un formato legible (ej: 01/01/2026)
export const formatDate = (isoDate) => {
  if (!isoDate) return 'Fecha no disponible';
  const date = new Date(isoDate);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// Oculta parcialmente el correo (ej: j***@gmail.com)
export const maskEmail = (email) => {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const maskedUser = user.charAt(0) + '***';
  return `${maskedUser}@${domain}`;
};