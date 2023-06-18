import 'vite/modulepreload-polyfill';
import express from 'express';
import fs from 'fs';
import {handleRouting} from './handleRouting';
import {createServer as createViteServer, loadEnv} from 'vite';
import { setupLocalS3 } from '../s3/setupLocalS3';
import { handleUploadFile } from './serverRoutes/uploadFile';
import { fsPaths } from '../fsPaths';
import { downloadFile } from './serverRoutes/downloadFile';
import path from 'path';
import { bucketName } from '../s3/s3Client';
import { env } from './serverEnv';

if (!fs.existsSync(fsPaths.tempUploadedAssets)) {
  fs.mkdirSync(fsPaths.tempUploadedAssets, {recursive: true});
} else {
  fs.rmSync(fsPaths.tempUploadedAssets, {recursive: true});
  fs.mkdirSync(fsPaths.tempUploadedAssets);
}

if (!fs.existsSync(fsPaths.s3UploadedAssets)) {
  fs.mkdirSync(fsPaths.s3UploadedAssets);
  fs.mkdirSync(path.resolve(fsPaths.s3UploadedAssets, `./${bucketName}`));
}

const createServer = async () => {
  const app = express();

  const viteServer = await createViteServer({
    server: {middlewareMode: true},
    appType: `custom`,
    
  });

  app.use(viteServer.middlewares);
  await setupLocalS3(app);

  app.post(`/api/upload`, handleUploadFile)
  app.get(`/api/download/:filename`, downloadFile)


  app.get(`*`, handleRouting)

  app.listen(env.PORT, () => {
    console.log(`app ready on port: ${env.PORT}`)
  });
}

createServer();