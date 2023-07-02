import * as fs from 'fs';
import path from 'path';
import {UploadPartCommandInput} from "@aws-sdk/client-s3";
import {PassThrough, Writable} from "stream";
import {bucketName, s3Client} from "../s3/s3Client";
import {fsPaths} from '../../fsPaths';
import {VolatileFileAndData} from '../types';
import {maxFileSize} from '../uploadFileSettings';

export const uploadFileFromFs = (file: VolatileFileAndData): Writable => {
  const pass = new PassThrough();
  const uploadedPath = path.resolve(fsPaths.fsUploadedAssets, `./${file.newFilename}`)
  fs.mkdirSync(uploadedPath)
  let chunks: Array<Buffer> = [];
  let currentSize = 0;
  let currentPart = 1;
  pass.on(`data`, async (chunk: Buffer) => {
    chunks.push(chunk);
    currentSize += chunk.byteLength;
    if (currentSize >= maxFileSize) {
      pass.pause();
      console.log(`paused stream`);
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(path.resolve(uploadedPath, `./part-${currentPart}`), buffer)
      console.log(`uploaded part ${currentPart} with size:`, currentSize);
      currentPart++;
      currentSize = 0;
      chunks = [];
      if (global.gc) global.gc();
      setTimeout(() => pass.resume(), 2000)
      // pass.resume();
    }
  })
  pass.on(`finish`, async () => {
    if (chunks.length > 0) {
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(path.resolve(uploadedPath, `./part-${currentPart}`), buffer)
    }
  })
  return pass;
}