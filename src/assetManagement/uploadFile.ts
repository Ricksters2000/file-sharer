import {Writable} from "stream";
import {VolatileFileAndData} from "./types";
import {UploadType, uploadType} from "./uploadFileSettings";
import {multipartUploadS3ObjectSync} from "./s3/putS3Object";
import {uploadFileFromFs} from "./fs/uploadFileFromFs";

export const uploadFile = (file: VolatileFileAndData): Writable => {
  if (uploadType === UploadType.s3) {
    return multipartUploadS3ObjectSync(file)
  } else if (uploadType === UploadType.fs) {
    return uploadFileFromFs(file)
  }
  throw new Error(`uploadType with unexpected value: ${uploadType}`)
}