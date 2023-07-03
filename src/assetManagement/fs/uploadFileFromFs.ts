import * as fs from 'fs';
import path from 'path';
import {PassThrough, Writable} from "stream";
import {FileMetadata, VolatileFileAndData} from '../types';
import {maxFileSize} from '../uploadFileSettings';
import {getFileMetadataPath, getFilePartPath, getUploadedFolderPath} from './getFilePathHelpers';

export const uploadFileFromFs = (file: VolatileFileAndData): Writable => {
  const pass = new PassThrough();
  const key = file.newFilename
  const uploadedPath = getUploadedFolderPath(key)
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
      fs.writeFileSync(getFilePartPath(key, currentPart), buffer)
      console.log(`uploaded part ${currentPart} with size:`, currentSize);
      currentPart++;
      currentSize = 0;
      chunks = [];
      if (global.gc) global.gc();
      // setTimeout(() => pass.resume(), 2000)
      pass.resume();
    }
  })
  pass.on(`finish`, async () => {
    if (chunks.length > 0) {
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(path.resolve(uploadedPath, `./part-${currentPart}`), buffer)
    }
    const fileMetadata: FileMetadata = {
      size: file.size,
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      parts: currentPart,
    }
    fs.writeFileSync(getFileMetadataPath(key), JSON.stringify(fileMetadata))
  })
  return pass;
}