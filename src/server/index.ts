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
import {logMemory} from '../utils/logMemory';
import {ProgressStatus, ProgressStatusAction} from '../assetManagement/types';
import {handleCancelUpload} from './serverRoutes/handleCancelUpload';
import bodyParser from 'body-parser';

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
  //   logMemory()
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
  app.put(`/api/cancel/:id`, handleCancelUpload(uploadProgressManager))
  app.get(`/api/download/:filename`, handleDownloadFile)
  app.get(`/api/progress/:id`, async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.flushHeaders()
    let data: ProgressStatusAction = {
      type: ProgressStatus.UNKNOWN,
      data: {}
    }
    const fileProgress = uploadProgressManager.getFileProgress(req.params.id)
    if (!fileProgress) {
      if (uploadProgressManager.isProgressCompleted(req.params.id)) {
        data = {
          type: ProgressStatus.COMPLETED,
          data: {}
        }
      }
    } else if (fileProgress === ProgressStatus.CANCELED) {
      data = {
        type: ProgressStatus.CANCELED,
        data: {}
      }
    } else {
      data = {
        type: ProgressStatus.ONGOING,
        data: fileProgress
      }
    }
    res.write(`data: ${JSON.stringify(data)}\n\n`)
    res.end()
  })

  app.get(`*`, handleRouting(viteServer))

  app.listen(Number(env.PORT), `0.0.0.0`, () => {
    console.log(`app ready on port: ${env.PORT}`)
  });
}

createServer();