import {File} from "formidable";
import VolatileFile from "formidable/VolatileFile";
import {FileProgress} from "./UploadProgressManager";

export type VolatileFileAndData = VolatileFile & File;

export type FileMetadata = {
  originalFilename: string | null;
  size: number;
  mimetype: string | null;
  parts: number;
}

export enum ProgressStatus {
  UNKNOWN,
  COMPLETED,
  ONGOING,
}

export type ProgressStatusAction = {
  type: ProgressStatus.UNKNOWN | ProgressStatus.COMPLETED;
  data: {};
} | {
  type: ProgressStatus.ONGOING;
  data: FileProgress;
}