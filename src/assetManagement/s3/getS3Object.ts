import { writeFileSync } from "fs";
import { bucketName, s3Client } from "./s3Client"

export const getS3Object = async (filename: string) => {
  const getObjectOutput = await s3Client.getObject({
    Bucket: bucketName,
    Key: `${filename}`,
  });
  const data = await getObjectOutput.Body?.transformToByteArray();
  console.log(`file metadata:`, getObjectOutput.Metadata)
  if (!data) return null;
  const buffer = Buffer.from(data);
  return buffer;
}