import { shortenUrl, getOriginalUrl, getUrlAnalytics } from '../services/shortenerService.js';
import { incrementClicks } from '../models/urlModel.js';

const handleShortenUrl = async (req, res) => {
  try {
    const { originalUrl, expiryDays } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: 'originalUrl is required'
      });
    }

    const result = await shortenUrl(originalUrl, expiryDays);

    return res.status(201).json({
      success: true,
      data: result
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const handleRedirect = async (req, res) => {
  try {
    const { code } = req.params;

    const url = await getOriginalUrl(code);

    await incrementClicks(code);

    return res.redirect(url.original_url);

  } catch (err) {
    return res.status(404).json({
      success: false,
      message: 'URL not found'
    });
  }
};

const handleGetAnalytics = async (req, res) => {
  try {
    const { code } = req.params;
    const stats = await getUrlAnalytics(code);

    return res.status(200).json({
      success: true,
      data: stats
    });

  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }
};

export { handleShortenUrl, handleRedirect, handleGetAnalytics };