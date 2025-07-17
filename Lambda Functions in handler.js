const AWS = require('aws-sdk');
const s3 = new AWS.S3({ signatureVersion: 'v4', region: 'us-east-1' }); // Change to your region
const BUCKET_NAME = 'cloudvault-user-files-jd-20231027'; // ❗️ Replace with your bucket name

// Helper to create a standard response
const createResponse = (statusCode, body) => ({
    statusCode,
    headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
});

// Helper to get the user's unique ID
const getUserId = (event) => event.requestContext.authorizer.claims.sub;

module.exports.listFiles = async (event) => {
    try {
        const userId = getUserId(event);
        const params = {
            Bucket: BUCKET_NAME,
            Prefix: `private/${userId}/`,
        };
        const data = await s3.listObjectsV2(params).promise();
        const files = data.Contents.map(file => ({
            key: file.Key.split('/').pop(), // Show only the filename
            lastModified: file.LastModified,
            size: file.Size,
        }));
        return createResponse(200, files);
    } catch (error) {
        return createResponse(500, { error: error.message });
    }
};

module.exports.getUploadUrl = async (event) => {
    try {
        const userId = getUserId(event);
        const { fileName, fileType } = event.queryStringParameters;
        const key = `private/${userId}/${fileName}`;

        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Expires: 60, // 1 minute
            ContentType: fileType,
        };
        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
        return createResponse(200, { uploadUrl });
    } catch (error) {
        return createResponse(500, { error: error.message });
    }
};

module.exports.getDownloadUrl = async (event) => {
    try {
        const userId = getUserId(event);
        const { key } = event.pathParameters;
        const s3Key = `private/${userId}/${key}`;

        const params = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Expires: 60,
        };
        const downloadUrl = await s3.getSignedUrlPromise('getObject', params);
        return createResponse(200, { downloadUrl });
    } catch (error) {
        return createResponse(500, { error: error.message });
    }
};


module.exports.deleteFile = async (event) => {
    try {
        const userId = getUserId(event);
        const { key } = event.pathParameters;
        const s3Key = `private/${userId}/${key}`;
        
        const params = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
        };
        await s3.deleteObject(params).promise();
        return createResponse(200, { message: `File ${key} deleted.` });
    } catch (error) {
        return createResponse(500, { error: error.message });
    }
};
