export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{8}$/;
  return regex.test(phone);
};

export const validateDUI = (dui) => {
  const regex = /^\d{8}-\d$/;
  return regex.test(dui);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateName = (name) => {
  return name.length >= 3 && name.length <= 50;
};

export const validateBirthdate = (birthdate) => {
  const date = new Date(birthdate);
  if (isNaN(date.getTime())) return false;
  const age = new Date().getFullYear() - date.getFullYear();
  return age >= 18;
};