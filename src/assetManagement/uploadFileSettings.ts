import {convertMinutesToMs} from "../utils/timeConversion";

export enum UploadType {
  fs,
  s3,
}

export const uploadType: UploadType = UploadType.fs;

/** If file size exceeds this amount then upload file in parts */
export const maxFileSize = 50 * 1024 * 1024;

export const flushCompletedProgressesDelay = convertMinutesToMs(10)