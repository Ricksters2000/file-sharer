import styled from '@emotion/styled';
import React, { useCallback } from 'react';
// @ts-ignore
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';

type OnDropCallback = <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void

export const Upload: React.FC<unknown> = () => {
  const [downloadLink, setDownloadLink] = React.useState(``)
  const onDrop = useCallback<OnDropCallback>(async (acceptedFiles) =>  {
    console.log(acceptedFiles)
    const formData = new FormData();
    formData.append(`files`, acceptedFiles[0])
    console.log(`sending data`)
    const res = await fetch(`/api/upload`, {
      method: `post`,
      // headers: {'content-type': `multipart/form-data`},
      body: formData,
    });
    const data = await res.text();
    setDownloadLink(data);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  return (
    <>
    <DropZoneDiv {...getRootProps()}>
      <input {...getInputProps()}/>
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </DropZoneDiv>
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

const DropZoneDiv = styled(`div`)`
  padding: 0.6em;
  box-sizing: border-box;
  font-family: sans-serif;
  border: 3px dashed #e0e0e0;
  user-select: none;
  margin: 0.33em auto;
  max-width: 320px;
  transition: 0.3s;
  cursor: pointer;
  text-align: center;
  font-size: 20px;
  line-height: 1.4;
  color: #4b4b4b;
  &:hover {
    border-color: black;
    color: black;
  }
`;