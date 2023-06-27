import '../viteUtils/modulePolyfill';
import express from 'express';
import fs from 'fs';
import {handleRouting} from './handleRouting';
import {ViteDevServer, createServer as createViteServer} from 'vite';
import { setupLocalS3 } from '../assetManagement/s3/setupLocalS3';
import { handleUploadFile } from './serverRoutes/uploadFile';
import { fsPaths } from '../fsPaths';
import { downloadFile } from './serverRoutes/downloadFile';
import path from 'path';
import { bucketName } from '../assetManagement/s3/s3Client';
import { env } from './serverEnv';
import {isProduction} from '../utils/isProduction';
import serveStatic from 'serve-static';

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
  // setInterval(() => {
  //   // console.log(`current memory used:`, process.memoryUsage().heapUsed / 1024 / 1024)
  //   const memoryUsage = process.memoryUsage()
  //   const divide = 1000000
  //   const total = memoryUsage.arrayBuffers + memoryUsage.external + memoryUsage.heapTotal + memoryUsage.heapUsed + memoryUsage.rss;
  //   // console.log(`current memory used:`, process.memoryUsage().heapUsed / 1024 / 1024)
  //   console.log(`full stats:`, {
  //     rss: memoryUsage.rss / divide,
  //     heapTotal: memoryUsage.heapTotal / divide,
  //     headUsed: memoryUsage.heapUsed / divide,
  //     external: memoryUsage.external / divide,
  //     arrayBuffers: memoryUsage.arrayBuffers / divide,
  //   })
  //   console.log(`total:`, total / divide)
  // }, 1000)

  const app = express();
  let viteServer: ViteDevServer | undefined
  if (!isProduction) {
    viteServer = await createViteServer({
      server: {middlewareMode: true},
      appType: `custom`,
      mode: `development`,
      configFile: fsPaths.clientConfigFile,
    });
    app.use(viteServer.middlewares);
  } else {
    app.use(serveStatic(fsPaths.clientDistFolder, {
      index: false,
    }))
  }
  
  await setupLocalS3(app);

  app.post(`/api/upload`, handleUploadFile)
  app.get(`/api/download/:filename`, downloadFile)

  app.get(`*`, handleRouting(viteServer))

  app.listen(env.PORT, () => {
    console.log(`app ready on port: ${env.PORT}`)
  });
}

createServer();