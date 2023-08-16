import {PassThrough, Writable} from "stream";
import {VolatileFileAndData} from "./types";
import {UploadType, uploadType} from "./uploadFileSettings";
import {multipartUploadS3ObjectSync} from "./s3/putS3Object";
import {uploadFileFromFs} from "./fs/uploadFileFromFs";
import {UploadProgressManager} from "./UploadProgressManager";
import IncomingForm from "formidable/Formidable";

export const uploadFile = (id: string, progressManager: UploadProgressManager) => (file: VolatileFileAndData): Writable => {
  const pass = new PassThrough()
  progressManager.listenForProgressEnd(id, () => {
    console.log(`ending pass`)
    pass.destroy()
  })
  if (uploadType === UploadType.s3) {
    return multipartUploadS3ObjectSync(pass, file)
  } else if (uploadType === UploadType.fs) {
    return uploadFileFromFs(pass, file)
  }
  throw new Error(`uploadType with unexpected value: ${uploadType}`)
}