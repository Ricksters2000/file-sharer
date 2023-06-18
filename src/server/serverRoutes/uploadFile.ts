import { Request, Response } from "express"
import formidable from 'formidable';
import { fsPaths } from "../../fsPaths";
import { putS3Object } from "../../s3/putS3Object";
import VolatileFile from "formidable/VolatileFile";
import { PassThrough } from "stream";

export const handleUploadFile = async (req: Request, res: Response) => {
  const form = formidable({
    maxFileSize: Infinity,
    uploadDir: fsPaths.tempUploadedAssets,
    fileWriteStreamHandler: putS3Object,
  });
  form.parse(req, async (err, fields, {files}) => {
    if (err) {
      res.status(404).send(`Error uploading file: ${err}`);
    }
    console.log(`fields:`, fields);
    console.log(`files:`, files);
    if (Array.isArray(files)) {
      
    } else {
      const key = files.originalFilename ?? files.newFilename;
      res.send(`/api/download/${files.newFilename}`);
    }
  })
  form.on(`progress`, (bytesReceived, bytesExpected) => {
    console.log(`progress on file upload: ${bytesReceived}/${bytesExpected}`)
  })
}