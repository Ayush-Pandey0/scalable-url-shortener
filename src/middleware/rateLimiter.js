import rateLimit from 'express-rate-limit';

const shortenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please wait before trying again.'
  }
});

export default shortenLimiter;