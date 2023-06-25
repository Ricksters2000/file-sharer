import { fileURLToPath } from "url";
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadedAssetsFolder = path.resolve(__dirname, `../.uploaded-assets/`);

export const fsPaths = {
  uploadedAssetsFolder,
  s3UploadedAssets: path.resolve(uploadedAssetsFolder, `./s3`),
  fsUploadedAssets: path.resolve(uploadedAssetsFolder, `./fs`),
  tempUploadedAssets: path.resolve(uploadedAssetsFolder, `./tmp`),
  clientConfigFile: path.resolve(__dirname, `../build/client.config.dev.ts`),
  envFile: path.resolve(__dirname, `../.env`),
  templateHtmlFile: path.resolve(__dirname, `../src/index.html`)
}