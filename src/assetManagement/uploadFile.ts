import {Writable} from "stream";
import {VolatileFileAndData} from "./types";
import {UploadType, uploadType} from "./uploadFileSettings";
import {multipartUploadS3ObjectSync} from "./s3/putS3Object";
import {uploadFileFromFs} from "./fs/uploadFileFromFs";
import {UploadProgressManager} from "./UploadProgressManager";
import IncomingForm from "formidable/Formidable";

export const uploadFile = (uploadProgressManager: UploadProgressManager, form: IncomingForm) => (file: VolatileFileAndData): Writable => {
  uploadProgressManager.startProgress(form, file.newFilename)
  if (uploadType === UploadType.s3) {
    return multipartUploadS3ObjectSync(file)
  } else if (uploadType === UploadType.fs) {
    return uploadFileFromFs(file)
  }
  throw new Error(`uploadType with unexpected value: ${uploadType}`)
}