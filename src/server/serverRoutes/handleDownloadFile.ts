import {Request, Response} from "express";
import {downloadFile} from "../../assetManagement/downloadFile";

export const handleDownloadFile = async  (req: Request, res: Response) => {
  console.log(`params:`, req.params, req.query)
  await downloadFile(res, req.params.filename)
  res.end();
}