export const isPhoneValid = (phone: string) => /^0\d{9,10}$/.test(phone);
