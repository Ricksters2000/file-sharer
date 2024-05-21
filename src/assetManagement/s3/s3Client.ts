import { S3 } from "@aws-sdk/client-s3";
import { env } from "../../server/serverEnv";

const accessKey = `S3RVER`;

export const bucketName = `file-sharer`;

export const s3Client = new S3({
  endpoint: `${env.HOST_NAME || `http://localhost:3000`}/s3`,
  region: `us-east-1`,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: accessKey,
  },
  forcePathStyle: true,
})