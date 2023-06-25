import { Request, Response } from "express"
import formidable, { EmitData } from 'formidable';
import { MultipartParser } from "formidable/parsers";
import { fsPaths } from "../../fsPaths";
import { multipartUploadS3ObjectSync, putS3Object } from "../../assetManagement/s3/putS3Object";
import VolatileFile from "formidable/VolatileFile";
import { PassThrough, Transform } from "stream";

export const handleUploadFile = async (req: Request, res: Response) => {
  console.log(`got request to upload file`)
  const form = formidable({
    // multiples: true,
    maxFileSize: Infinity,
    maxTotalFileSize: Infinity,
    uploadDir: fsPaths.tempUploadedAssets,
    fileWriteStreamHandler: multipartUploadS3ObjectSync,
  });
  // form.use(customPlugin)
  await form.parse(req);
  // form.parse(req, async (err, fields, formidableFile) => {
  //   if (err) {
  //     console.log(`err:`, err)
  //     res.status(404).send(`Error uploading file: ${err}`);
  //   }
  //   const {files} = formidableFile;
  //   // console.log(`formidable:`, formidableFile)
  //   console.log(`fields:`, fields);
  //   // console.log(`files:`, files);
  //   if (Array.isArray(files)) {
      
  //   } else {
  //     // const key = files.originalFilename ?? files.newFilename;
  //     // res.send(`/api/download/${files.newFilename}`);
  //     // res.send(`/api/download/`);
  //   }
  // })
  // form.on(`data`, (data) => {
  //   console.log(`on data:`, data)
  // })
  // form.on(`file`, (name, file) => {
  //   console.log(`on file:`, name, file)
  // })
  // form.onPart = (part) => {
  //   console.log(`part:`, part)
  //   part.on(`data`, (data) => {
  //     console.log(`part data:`, data)
  //   })
  // }
  form.on(`progress`, (bytesReceived, bytesExpected) => {
    // console.log(`progress on file upload: ${bytesReceived}/${bytesExpected}`)
  })
}