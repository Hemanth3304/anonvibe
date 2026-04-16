import express from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../config/logger.js';

const router = express.Router();

let s3Client;
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

router.post('/presigned-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    logger.info(`Requested presigned URL for: ${fileName}`);

    const key = `media/${Date.now()}-${fileName}`;

    if (!s3Client || !process.env.S3_BUCKET) {
      logger.warn('S3 credentials not configured; sending fallback URL.');
      return res.json({
        url: 'https://placeholder-s3-url.com/upload',
        key
      });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiration
    
    res.json({
      url: uploadUrl,
      key
    });
  } catch (error) {
    logger.error(`Error generating presigned URL: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

export { router as mediaRouter };
