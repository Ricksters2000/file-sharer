import '../viteUtils/modulePolyfill';
import express from 'express';
import fs from 'fs';
import {handleRouting} from './handleRouting';
import {ViteDevServer, createServer as createViteServer} from 'vite';
import { setupLocalS3 } from '../assetManagement/s3/setupLocalS3';
import { handleUploadFile } from './serverRoutes/handleUploadFile';
import { fsPaths } from '../fsPaths';
import { handleDownloadFile } from './serverRoutes/handleDownloadFile';
import path from 'path';
import { bucketName } from '../assetManagement/s3/s3Client';
import { env } from './serverEnv';
import {isProduction} from '../utils/isProduction';
import serveStatic from 'serve-static';
import {UploadType, uploadType} from '../assetManagement/uploadFileSettings';
import {UploadProgressManager} from '../assetManagement/UploadProgressManager';

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

if (!fs.existsSync(fsPaths.fsUploadedAssets)) {
  fs.mkdirSync(fsPaths.fsUploadedAssets);
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

  const uploadProgressManager = new UploadProgressManager()
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
  
  if (uploadType === UploadType.s3) {
    await setupLocalS3(app);
  }

  app.post(`/api/upload/:id`, handleUploadFile(uploadProgressManager))
  app.get(`/api/download/:filename`, handleDownloadFile)
  app.get(`/api/progress/:id`, async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.flushHeaders()
    res.write(`data: ${JSON.stringify(uploadProgressManager.getFileProgress(req.params.id))}\n\n`)
    res.end()
  })

  app.get(`*`, handleRouting(viteServer))

  app.listen(env.PORT, () => {
    console.log(`app ready on port: ${env.PORT}`)
  });
}

createServer();