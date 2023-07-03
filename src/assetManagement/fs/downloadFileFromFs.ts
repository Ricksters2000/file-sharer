import * as fs from 'fs';
import {Response} from "express";
import {getFileMetadataPath, getFilePartPath} from './getFilePathHelpers';
import {FileMetadata} from '../types';

export const downloadFileFromFs = (res: Response, key: string) => {
  if (!fs.existsSync(getFileMetadataPath(key))) {
    res.write(`file metadata not found`)
    return
  }
  const fileMetadata = JSON.parse(fs.readFileSync(getFileMetadataPath(key), `utf-8`)) as FileMetadata
  res.header(`Content-disposition`, `attachment; filename=${fileMetadata.originalFilename}`);
  res.header(`Content-type`, fileMetadata.mimetype ?? `application`);
  for (let i = 1; i <= fileMetadata.parts; i++) {
    const buffer = fs.readFileSync(getFilePartPath(key, i))
    res.write(buffer)
  }
}