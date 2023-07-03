import {Response} from "express"
import {downloadFileFromFs} from "./fs/downloadFileFromFs"
import {getS3Object} from "./s3/getS3Object"
import {uploadType, UploadType} from "./uploadFileSettings"

export const downloadFile = (res: Response, key: string) => {
  if (uploadType === UploadType.s3) {
    return getS3Object(key)
  } else if (uploadType === UploadType.fs) {
    return downloadFileFromFs(res, key)
  }
  throw new Error(`uploadType with unexpected value: ${uploadType}`)
}