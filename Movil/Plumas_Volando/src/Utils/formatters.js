// Formatea un número a moneda (ej: $12.00) — maneja undefined, null y NaN
export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return '$0.00';
  return `$${num.toFixed(2)}`;
};

// Formatea una fecha ISO a formato legible (ej: 01/01/2026)
export const formatDate = (isoDate) => {
  if (!isoDate) return 'Fecha no disponible';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Fecha no disponible';
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Formatea una fecha ISO con hora (ej: 01/01/2026 · 14:35)
export const formatDateTime = (isoDate) => {
  if (!isoDate) return 'Fecha no disponible';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Fecha no disponible';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} · ${hours}:${minutes}`;
};

// Oculta parcialmente el correo (ej: j***@gmail.com)
export const maskEmail = (email) => {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const maskedUser = user.charAt(0) + '***';
  return `${maskedUser}@${domain}`;
};
