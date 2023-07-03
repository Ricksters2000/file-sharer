import path from "path";
import {fsPaths} from "../../fsPaths";

const metadataKey = `_metadata.json`
const partKey = `part-`

export const getUploadedFolderPath = (key: string) => path.resolve(fsPaths.fsUploadedAssets, `./${key}`)

export const getFileMetadataPath = (key: string) => path.resolve(getUploadedFolderPath(key), `./${metadataKey}`)

export const getFilePartPath = (key: string, partNumber: number) => path.resolve(getUploadedFolderPath(key), `./${partKey}${partNumber}`)