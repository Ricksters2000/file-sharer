import {File} from "formidable";
import VolatileFile from "formidable/VolatileFile";

export type VolatileFileAndData = VolatileFile & File;

export type FileMetadata = {
  
}