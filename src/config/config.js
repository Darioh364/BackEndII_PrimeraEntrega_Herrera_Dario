import dotenv from 'dotenv';

dotenv.config(); // Carga las variables desde .env

const config = {
  jwtSecret: process.env.JWT_SECRET,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  mongoUrl: process.env.MONGO_URL
};

export default config;
