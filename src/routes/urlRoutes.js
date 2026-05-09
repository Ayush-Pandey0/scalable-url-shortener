import express from 'express';
import { handleShortenUrl, handleRedirect, handleGetAnalytics } from '../controllers/urlController.js';
import shortenLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/shorten', shortenLimiter, handleShortenUrl);

router.get('/analytics/:code', handleGetAnalytics);
router.get('/:code', handleRedirect);

export default router;