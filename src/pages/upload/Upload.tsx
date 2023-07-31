import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
// @ts-ignore
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import {FileProgress} from '../../assetManagement/UploadProgressManager';
import {UploadedFile} from './UploadedFile';

type OnDropCallback = <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void
export const Upload: React.FC<unknown> = () => {
  const [downloadLink, setDownloadLink] = React.useState(``)
  const [uploadedFiles, setUploadedFiles] = React.useState<Array<Blob>>([])
  const onDrop = useCallback<OnDropCallback>(async (acceptedFiles) =>  {
    console.log(acceptedFiles)
    setUploadedFiles(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  return (
    <>
    <DropZoneDiv {...getRootProps()}>
      <input {...getInputProps()}/>
      <StyledUploadIcon/>
      <ProgressContainer>
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </ProgressContainer>
    </DropZoneDiv>
    {uploadedFiles.map((uploadedFile, i) =>
      <UploadedFile key={`${uploadedFile.name}-${i}`} localFile={uploadedFile}/>
    )}
    {downloadLink && <a href={downloadLink}>Download</a>}
    <h2>With Node.js <code>"http"</code> module</h2>
    <form action="/api/upload" encType="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="multipleFiles" multiple={true} /></div>
      <input type="submit" value="Upload" />
    </form>
    </>
  )
}

const StyledUploadIcon = styled.svg({
  margin: `0 8px`,
  height: `100%`,
  borderRight: `3px dashed #e0e0e0`,
  borderColor: `inherit`,
  paddingRight: `8px`,
}).withComponent(UploadIcon);

const DropZoneDiv = styled.div({
  display: `flex`,
  height: `50px`,
  padding: 0,
  alignItems: `center`,
  boxSizing: `border-box`,
  fontFamily: `sans-serif`,
  border: `3px dashed #e0e0e0`,
  userSelect: `none`,
  margin: `0.33em auto`,
  transition: `0.3s`,
  cursor: `pointer`,
  textAlign: `center`,
  fontSize: `20px`,
  lineHeight: `1.4`,
  color: `#4b4b4b`,
  ":hover": {
    borderColor: `black`,
    color: `black`,
  },
});

const ProgressContainer = styled.div({
  display: `flex`,
  flexDirection: `column`,
})