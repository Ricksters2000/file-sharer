import {File} from "formidable";
import VolatileFile from "formidable/VolatileFile";

export type VolatileFileAndData = VolatileFile & File;

export type FileMetadata = {
  originalFilename: string | null;
  size: number;
  mimetype: string | null;
  parts: number;
}