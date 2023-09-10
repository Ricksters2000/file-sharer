import { Request, Response } from "express"
import formidable from 'formidable';
import { fsPaths } from "../../fsPaths";
import {uploadFile} from "../../assetManagement/uploadFile";
import {UploadProgressManager} from "../../assetManagement/UploadProgressManager";
import {logMemory} from "../../utils/logMemory";
import {UploadResponse} from "../../utils/UploadResponse";
import {formatFormidableError} from "../../utils/formatFormidableError";

export const handleUploadFile = (uploadProgressManager: UploadProgressManager) => async (req: Request, res: Response) => {
  const form = formidable({
    maxFileSize: 1024 * 1024 * 50,
    uploadDir: fsPaths.tempUploadedAssets,
    // @ts-ignore
    fileWriteStreamHandler: uploadFile(req.params.id, uploadProgressManager),
  });
  uploadProgressManager.startProgress(form, req.params.id);
  form.parse(req, async (err, fields, formidableFile) => {
    if (err) {
      console.log(`err:`, err.toString())
      const data: UploadResponse = {
        type: `error`,
        error: formatFormidableError(err),
      }
      res.json(data);
      return
    }
    const {files} = formidableFile;
    console.log(`files: ${files}`)
    if (!files || Array.isArray(files) && files.length === 0) {
      res.send(null)
      return
    }
    console.log(`fields:`, fields);
    logMemory()
    if (!Array.isArray(files)) {
      const data: UploadResponse = {
        type: `completed`,
        uploadPath: files.newFilename,
      }
      res.json(data)
    } else {
      // res.send(`/api/download/${files.newFilename}`);
    }
  })
}