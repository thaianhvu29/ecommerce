const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'ap-southeast-2'
});

const BUCKET =
    process.env.S3_BUCKET ||
    'thaianhvu-ecommerce-2026-731246410488';

async function uploadToS3(file) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');

    const key = `products/${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        })
    );

    return `https://${BUCKET}.s3.${process.env.AWS_REGION || 'ap-southeast-2'}.amazonaws.com/${key}`;
}

module.exports = {
    uploadToS3
};
