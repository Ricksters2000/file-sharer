import { Request, Response } from "express";
import { getS3Object } from "../../s3/getS3Object";

export const downloadFile = async  (req: Request, res: Response) => {
  console.log(`params:`, req.params, req.query)
  const buffer = await getS3Object(req.params.filename);
  if (!buffer) {
    res.status(400).send(`Failed to download file`);
  }
  res.header(`Content-disposition`, `attachment; filename=${req.params.filename}`);
  res.header(`Content-type`, `application`);
  // res.header(`Cache-Control`, `public, max-age=${60 * 60 * 24}`);
  res.write(buffer, (err) => {
    if (err) {
      console.log(`Error on download:`, err)
    }
  });
  res.end();
}