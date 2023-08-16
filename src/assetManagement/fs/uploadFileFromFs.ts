import * as fs from 'fs';
import path from 'path';
import {PassThrough, Writable} from "stream";
import {FileMetadata, VolatileFileAndData} from '../types';
import {maxFileSize} from '../uploadFileSettings';
import {getFileMetadataPath, getFilePartPath, getUploadedFolderPath} from './getFilePathHelpers';

export const uploadFileFromFs = (pass: PassThrough, file: VolatileFileAndData): Writable => {
  const onClose = () => {
    chunks = [];
    console.log(`canceling fs upload`)
    if (fs.existsSync(uploadedPath)) {
      fs.rmSync(uploadedPath, {recursive: true})
    }
  }
  const key = file.newFilename
  const uploadedPath = getUploadedFolderPath(key)
  fs.mkdirSync(uploadedPath)
  let chunks: Array<Buffer> = [];
  let currentSize = 0;
  let currentPart = 1;
  pass.on(`close`, onClose);
  pass.on(`data`, async (chunk: Buffer) => {
    chunks.push(chunk);
    currentSize += chunk.byteLength;
    if (currentSize >= maxFileSize) {
      pass.pause();
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(getFilePartPath(key, currentPart), buffer)
      console.log(`uploaded part ${currentPart} with size:`, currentSize);
      currentPart++;
      currentSize = 0;
      chunks = [];
      if (global.gc) global.gc();
      setTimeout(() => pass.resume(), 2000)
    }
  })
  pass.on(`finish`, async () => {
    pass.off(`close`, onClose)
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