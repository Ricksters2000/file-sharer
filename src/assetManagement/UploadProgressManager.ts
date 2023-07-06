import {Request} from "express";
import formidable from "formidable";
import {fsPaths} from "../fsPaths";
import IncomingForm from "formidable/Formidable";

type FileProgress = {
  currentProgress: number;
  maxProgress: number;
}

export class UploadProgressManager {
  private fileProgresses: Record<string, FileProgress>;

  constructor () {
    this.fileProgresses = {}
  }

  public getFileProgress = (fileId: string) => this.fileProgresses[fileId]

  public async startProgress(form: IncomingForm, fileId: string) {
    form.on(`progress`, (bytesReceived, bytesExpected) => {
      this.setProgress(fileId, bytesReceived, bytesExpected)
    })
    form.on(`file`, (formName, file) => {
      console.log(`file completed:`, file.newFilename)
      this.removeProgress(file.newFilename)
    })
  }

  private setProgress(fileId: string, currentProgress: number, maxProgress: number) {
    this.fileProgresses[fileId] = {
      currentProgress,
      maxProgress,
    }
  }

  private removeProgress(fileId: string) {
    const {[fileId]: fileProgress, ...rest} = this.fileProgresses
    this.fileProgresses = {...rest}
  }
}