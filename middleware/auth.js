const validateHeaders = (req, res, next) => {
    // Extract API key and bearer token from headers
    const apiKey = req.headers['x-api-key'];
    const authHeader = req.headers['authorization'];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Invalid or missing API key' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    if (!isValidToken(token)) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    next();
};

const isValidToken = (token) => {
    return token === process.env.BEARER_TOKEN;
};

module.exports = validateHeaders;
