import { Request, Response } from "express"
import formidable, { EmitData } from 'formidable';
import { MultipartParser } from "formidable/parsers";
import { fsPaths } from "../../fsPaths";
import {uploadFile} from "../../assetManagement/uploadFile";
import {UploadProgressManager} from "../../assetManagement/UploadProgressManager";
import {logMemory} from "../../utils/logMemory";

export const handleUploadFile = (uploadProgressManager: UploadProgressManager) => async (req: Request, res: Response) => {
  console.log(`got request to upload file`)
  const form = formidable({
    // multiples: true,
    maxFileSize: Infinity,
    maxTotalFileSize: Infinity,
    uploadDir: fsPaths.tempUploadedAssets,
    // @ts-ignore
    fileWriteStreamHandler: uploadFile,
  });
  uploadProgressManager.startProgress(form, req.params.id);
  form.parse(req, async (err, fields, formidableFile) => {
    if (err) {
      console.log(`err:`, err)
      res.status(404).send(`Error uploading file: ${err}`);
    }
    const {files} = formidableFile;
    // console.log(`formidable:`, formidableFile)
    console.log(`fields:`, fields);
    logMemory()
    // console.log(`files:`, files);
    if (Array.isArray(files)) {
      
    } else {
      // const key = files.originalFilename ?? files.newFilename;
      res.send(`/api/download/${files.newFilename}`);
      // res.send(`/api/download/`);
    }
  })
  // form.on(`progress`, (bytesReceived, bytesExpected) => {
  //   console.log(`progress on file upload: ${bytesReceived}/${bytesExpected}`)
  // })
}