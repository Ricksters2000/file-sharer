import IncomingForm from "formidable/Formidable";

export type FileProgress = {
  currentProgress: number;
  maxProgress: number;
}

export class UploadProgressManager {
  private fileProgresses: Record<string, FileProgress>;

  constructor () {
    this.fileProgresses = {}
  }

  public getFileProgress = (fileId: string) => this.fileProgresses[fileId]

  public async startProgress(form: IncomingForm, id: string) {
    form.on(`progress`, (bytesReceived, bytesExpected) => {
      this.setProgress(id, bytesReceived, bytesExpected)
    })
    form.on(`file`, (formName, file) => {
      this.removeProgress(id)
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