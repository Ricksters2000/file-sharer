import { Request, Response } from "express"
import formidable from 'formidable';
import { fsPaths } from "../../fsPaths";
import {uploadFile} from "../../assetManagement/uploadFile";
import {UploadProgressManager} from "../../assetManagement/UploadProgressManager";
import {logMemory} from "../../utils/logMemory";

export const handleUploadFile = (uploadProgressManager: UploadProgressManager) => async (req: Request, res: Response) => {
  console.log(`got request to upload file`)
  const form = formidable({
    maxFileSize: Infinity,
    maxTotalFileSize: Infinity,
    uploadDir: fsPaths.tempUploadedAssets,
    // @ts-ignore
    fileWriteStreamHandler: uploadFile(req.params.id, uploadProgressManager),
  });
  uploadProgressManager.startProgress(form, req.params.id);
  form.parse(req, async (err, fields, formidableFile) => {
    if (err) {
      console.log(`err:`, err)
      res.status(404).send(`Error uploading file: ${err}`);
    }
    const {files} = formidableFile;
    console.log(`files: ${files}`)
    if (!files || Array.isArray(files) && files.length === 0) {
      res.send(null)
      return
    }
    console.log(`fields:`, fields);
    logMemory()
    if (Array.isArray(files)) {
      
    } else {
      res.send(`/api/download/${files.newFilename}`);
    }
  })
}