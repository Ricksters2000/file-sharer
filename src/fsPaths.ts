import { fileURLToPath } from "url";
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadedAssetsFolder = path.resolve(__dirname, `../.uploaded-assets/`);

export const fsPaths = {
  uploadedAssetsFolder,
  s3UploadedAssets: path.resolve(uploadedAssetsFolder, `./s3`),
  tempUploadedAssets: path.resolve(uploadedAssetsFolder, `./tmp`),
}