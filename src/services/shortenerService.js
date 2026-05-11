import { createUrl, findUrlByCode, incrementClicks, getUrlStats } from '../models/urlModel.js';
import generateCode from '../utils/generateCode.js';
import redisClient from '../config/redis.js';

const CACHE_EXPIRY = 3600;

const shortenUrl = async (originalUrl, expiryDays = null, baseUrl) => {
  let shortCode = generateCode();

  const existing = await findUrlByCode(shortCode);
  if (existing) {
    shortCode = generateCode();
  }

  let expiresAt = null;
  if (expiryDays) {
    const date = new Date();
    date.setDate(date.getDate() + expiryDays);
    expiresAt = date.toISOString().slice(0, 19).replace('T', ' ');
  }

  await createUrl(originalUrl, shortCode, expiresAt);

  return {
    originalUrl,
    shortCode,
    shortUrl: `${baseUrl}/${shortCode}`,
    expiresAt: expiresAt || 'Never'
  };
};

const getOriginalUrl = async (shortCode) => {
  const cached = await redisClient.get(shortCode);

  if (cached) {
    console.log('[CACHE HIT] Found', shortCode, 'in Redis');
    const url = JSON.parse(cached);

    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      throw new Error('This URL has expired');
    }

    return url;
  }

  console.log('[CACHE MISS] Fetching', shortCode, 'from MySQL');

  const url = await findUrlByCode(shortCode);

  if (!url) {
    throw new Error('URL not found');
  }

  if (url.expires_at && new Date(url.expires_at) < new Date()) {
    throw new Error('This URL has expired');
  }

  await redisClient.setEx(shortCode, CACHE_EXPIRY, JSON.stringify(url));

  return url;
};

const getUrlAnalytics = async (shortCode, baseUrl) => {
  const stats = await getUrlStats(shortCode);

  if (!stats) {
    throw new Error('URL not found');
  }

  return {
    shortCode: stats.short_code,
    originalUrl: stats.original_url,
    clicks: stats.clicks,
    createdAt: stats.created_at,
    expiresAt: stats.expires_at || 'Never',
    shortUrl: `${baseUrl}/${stats.short_code}`
  };
};

export { shortenUrl, getOriginalUrl, getUrlAnalytics };