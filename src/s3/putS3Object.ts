import zlib from "zlib";
import util from 'util';
import { bucketName, s3Client } from "./s3Client";
import { CompletedMultipartUpload, UploadPartCommandInput, UploadPartCommandOutput } from "@aws-sdk/client-s3";
import VolatileFile from "formidable/VolatileFile";
import { PassThrough, Writable } from "stream";

// gb * mb * kb * bytes = 5GB
const maxSizePerUpload = 5 * 1000 * 1024 * 1024;
const fiveMgbs = 100 * 1024 * 1024;

export const putS3Object = (file?: VolatileFile): Writable => {
  // const compressedData = zlib.gzipSync(buffer);
  const pass = new PassThrough();
  // try {
    const putObjectOutput = s3Client.putObject({
      Bucket: bucketName,
      // @ts-ignore
      Key: file.newFilename,
      Body: pass,
    })
    console.log(`put object:`, putObjectOutput)
    return pass;
  // } catch (e) {
  //   console.log(`Error put object to s3:`, e)
  // }
}

export const multipartUploadS3Object = async (buffer: Buffer, key: string) => {
  try {
    const compressedData = zlib.gzipSync(buffer);
    const multipartUpload = await s3Client.createMultipartUpload({
      Bucket: bucketName,
      Key: key,
    })
    const uploadId = multipartUpload.UploadId;
    const uploadedParts: Array<UploadPartCommandOutput> = [];
    const amountOfParts = Math.ceil(buffer.byteLength / maxSizePerUpload);
    // Upload each part.
    for (let i = 0; i < amountOfParts; i++) {
      const start = i * maxSizePerUpload;
      const end = start + maxSizePerUpload;
      const uploadPartProps: UploadPartCommandInput = {
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
        Body: buffer.subarray(start, end),
        PartNumber: i + 1,
      }
      const uploadPartOutput = await s3Client.uploadPart(uploadPartProps);
      uploadedParts.push(uploadPartOutput);
    }
    const completeMultipartOutput = await s3Client.completeMultipartUpload({
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: uploadedParts
      }
    })
  } catch (err) {
    console.log(`Unexpected Error uploading large file`, err)
  }
}

export const multipartUploadS3ObjectSync = (file?: VolatileFile) => {
  try {
    const pass = new PassThrough();
    console.log(`receieved file:`, file);
    // @ts-ignore
    const key: string = file.newFilename
    const multipartUploadPromise = s3Client.createMultipartUpload({
      Bucket: bucketName,
      Key: key,
    })
    multipartUploadPromise.then(async multipartUpload => {
      let chunks: Array<Buffer> = [];
      const uploadId = multipartUpload.UploadId;
      const uploadedParts: Array<UploadPartCommandOutput> = [];
      let currentSize = 0;
      let currentPart = 1;
      pass.on(`data`, async (chunk: Buffer) => {
        console.log(`memory used:`, process.memoryUsage().heapUsed / 1024 / 1024)
        chunks.push(chunk);
        currentSize += chunk.byteLength;
        console.log(`received chunk, current size:`, currentSize)
        if (currentSize >= fiveMgbs) {
          pass.pause();
          console.log(`paused stream`);
          const buffer = Buffer.concat(chunks);
          const uploadPartProps: UploadPartCommandInput = {
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            Body: buffer,
            PartNumber: currentPart,
          }
          const uploadPartOutput = await s3Client.uploadPart(uploadPartProps);
          uploadedParts.push(uploadPartOutput);
          console.log(`uploaded part ${currentPart} with size:`, currentSize);
          currentPart++;
          currentSize = 0;
          chunks = [];
          console.log(`memory for next part:`, process.memoryUsage().heapUsed / 1024 / 1024)
          // if (global.gc) global.gc();
          setTimeout(() => pass.resume(), 1000)
          // pass.resume();
        }
      })
      pass.on(`finish`, async () => {
        const completeMultipartOutput = await s3Client.completeMultipartUpload({
          Bucket: bucketName,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: uploadedParts.map((uploadedPart, i) => ({
              ETag: uploadedPart.ETag,
              PartNumber: i + 1,
            }))
          }
        })
        console.log(`finished uploading parts:`, completeMultipartOutput)
      })
    })
    return pass;
  } catch (err) {
    console.log(`Unexpected Error uploading large file`, err)
    throw new Error(`${err}`);
  }
}