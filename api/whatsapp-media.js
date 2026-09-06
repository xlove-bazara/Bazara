// Vercel Serverless Function: Meta WhatsApp Cloud API Media Proxy
// Fetches media from Meta using server-side token without leaking credentials to client

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = process.env.WHATSAPP_TOKEN || process.env.VITE_WHATSAPP_TOKEN || process.env.META_ACCESS_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'Server configuration error: WHATSAPP_TOKEN is missing' });
  }

  // 1. GET: FETCH / PROXY MEDIA BY MEDIA_ID
  if (req.method === 'GET') {
    const { media_id } = req.query;

    if (!media_id) {
      return res.status(400).json({ error: 'media_id parameter is required' });
    }

    try {
      // Step 1: Query Meta to get media URL
      const metaInfoRes = await fetch(`https://graph.facebook.com/v20.0/${media_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!metaInfoRes.ok) {
        const errJson = await metaInfoRes.json();
        return res.status(metaInfoRes.status).json({ error: errJson.error?.message || 'Failed to retrieve media metadata' });
      }

      const mediaMetadata = await metaInfoRes.json();
      const directUrl = mediaMetadata.url;
      const mimeType = mediaMetadata.mime_type || 'application/octet-stream';

      if (!directUrl) {
        return res.status(404).json({ error: 'Media URL not found in Meta response' });
      }

      // Step 2: Stream binary from Meta
      const binaryRes = await fetch(directUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!binaryRes.ok) {
        return res.status(binaryRes.status).json({ error: 'Failed to download binary from Meta CDN' });
      }

      const arrayBuffer = await binaryRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
      return res.status(200).send(buffer);
    } catch (error) {
      console.error('[WhatsApp Media Proxy] Error:', error);
      return res.status(500).json({ error: error.message || 'Media proxy retrieval failed' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
