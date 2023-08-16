import {Request, Response} from "express"
import {UploadProgressManager} from "../../assetManagement/UploadProgressManager";

export const handleCancelUpload = (progressManager: UploadProgressManager) => async (req: Request, res: Response) => {
  const {id} = req.params;
  progressManager.cancelUpload(id);
  console.log(`sending cancel upload`)
  res.send(`upload canceled`);
}