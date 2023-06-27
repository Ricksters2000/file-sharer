import { fileURLToPath } from "url";
import path from 'path'
import {isProduction} from "./utils/isProduction";

// const __filename = fileURLToPath(import.meta.url);
const root = process.cwd();

const uploadedAssetsFolder = path.resolve(root, `./.uploaded-assets/`);

export const fsPaths = {
  uploadedAssetsFolder,
  s3UploadedAssets: path.resolve(uploadedAssetsFolder, `./s3`),
  fsUploadedAssets: path.resolve(uploadedAssetsFolder, `./fs`),
  tempUploadedAssets: path.resolve(uploadedAssetsFolder, `./tmp`),
  clientConfigFile: path.resolve(root, `./build/client.config.ts`),
  envFile: path.resolve(root, `./.env`),
  templateHtmlFile: {
    dev: path.resolve(root, `./index.html`),
    prod: path.resolve(root, `./dist/client/index.html`),
  },
  devScriptsHtmlFile: path.resolve(root, `./src/devScripts.html`),
  serverSsrEntryFile: '/src/server/serverSsrEntry.tsx',
  clientDistFolder: path.resolve(root, `./dist/client`)
}