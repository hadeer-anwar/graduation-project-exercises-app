import crypto from 'crypto'

export const generateResetCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); 
  };

  export const hashResetCode = (resetCode) => {
    return crypto.createHash('sha256').update(resetCode).digest('hex');
  };