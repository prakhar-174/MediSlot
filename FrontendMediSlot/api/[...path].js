export default async function handler(req, res) {
  // req.url contains the full path, e.g., /api/auth/register/
  const targetUrl = `http://3.238.39.174:8000${req.url}`;
  
  try {
    const options = {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers['authorization'] || ''
      },
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(502).json({ 
      error: 'Vercel Proxy connection failed. The AWS backend might be down.', 
      details: error.message,
      targetUrl 
    });
  }
}
