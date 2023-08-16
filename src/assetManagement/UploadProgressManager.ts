import IncomingForm from "formidable/Formidable";
import {logMemory} from "../utils/logMemory";
import {flushCompletedProgressesDelay} from "./uploadFileSettings";
import {EventEmitter} from 'events';

export type FileProgress = {
  currentProgress: number;
  maxProgress: number;
}

export class UploadProgressManager {
  private fileProgresses: Record<string, FileProgress>;
  private completedProgresses: Record<string, Date>;
  private progressEvent: EventEmitter;

  constructor () {
    this.fileProgresses = {}
    this.completedProgresses = {}
    this.progressEvent = new EventEmitter()
    setInterval(this.flushCompleted, flushCompletedProgressesDelay)
  }

  public getFileProgress = (fileId: string) => this.fileProgresses[fileId]
  public isProgressCompleted = (fileId: string) => !!this.completedProgresses[fileId]

  public async startProgress(form: IncomingForm, id: string) {
    form.on(`progress`, (bytesReceived, bytesExpected) => {
      this.setProgress(id, bytesReceived, bytesExpected)
    })
    form.on(`file`, (formName, file) => {
      this.markAsCompleted(id)
    })
  }

  public listenForProgressEnd(id: string, cb: () => void) {
    console.log(`listengin for progress end for id: ${id}`)
    this.progressEvent.addListener(`progress_end_${id}`, cb)
  }

  public cancelUpload(id: string) {
    console.log(`emitting cancel event for id: ${id}`)
    this.progressEvent.emit(`progress_end_${id}`)
  }

  private setProgress(fileId: string, currentProgress: number, maxProgress: number) {
    // logMemory()
    // console.log(`progress:`, currentProgress, maxProgress)
    this.fileProgresses[fileId] = {
      currentProgress,
      maxProgress,
    }
  }

  private markAsCompleted(fileId: string) {
    this.progressEvent.emit(`progress_end_${fileId}`)
    const {[fileId]: fileProgress, ...rest} = this.fileProgresses
    this.fileProgresses = {...rest}
    this.completedProgresses = {
      ...this.completedProgresses,
      [fileId]: new Date(),
    }
  }

  private flushCompleted = () => {
    console.log(`flushing completed progresses...`)
    const currentDate = new Date()
    for (const key in this.completedProgresses) {
      const timePassed = currentDate.getTime() - this.completedProgresses[key].getTime()
      if (timePassed >= flushCompletedProgressesDelay) {
        delete this.completedProgresses[key]
        console.log(`removed progress:`, key)
      }
    }
  }
}