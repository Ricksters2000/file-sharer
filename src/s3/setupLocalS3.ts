import { Express, Request, Response, NextFunction } from "express"
import S3rver from 's3rver';
import { fsPaths } from "../fsPaths";
import { bucketName } from "./s3Client";

export const s3Route = `/s3`;

export const setupLocalS3 = async (app: Express) => {
  const s3rver = new S3rver({
    directory: fsPaths.s3UploadedAssets,
    silent: false,
    resetOnClose: true,
    configureBuckets: [
      {
        name: bucketName,
        configs: [],
      }
    ]
  })
  app.all(`${s3Route}/*`, s3rverMiddlewareHelper, s3rver.getMiddleware())
}

const s3rverMiddlewareHelper = (req: Request, res: Response, next: NextFunction) => {
  req.url = req.url.substring(s3Route.length);
  next();
}