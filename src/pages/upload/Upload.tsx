import styled from '@emotion/styled';
import React, {useCallback} from 'react';
// @ts-ignore
import {DropEvent, FileRejection, useDropzone} from 'react-dropzone';
import {UploadedFile} from './UploadedFile';
import UploadIcon from '../../assets/upload-icon.svg';

type OnDropCallback = <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void
export const Upload: React.FC<unknown> = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState<Array<Blob>>([])
  const onDrop = useCallback<OnDropCallback>(async (acceptedFiles) =>  {
    console.log(acceptedFiles)
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  return (
    <Root>
      <DropZoneDiv {...getRootProps()}>
        <input {...getInputProps()}/>
        <StyledUploadIcon src={UploadIcon}/>
        <DropZoneTextContainer>
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </DropZoneTextContainer>
      </DropZoneDiv>
      <UploadedFilesContainer>
        <Heading>Uploaded Files</Heading>
        {uploadedFiles.map((uploadedFile, i) =>
          <UploadedFile key={`${uploadedFile.name}-${i}`} localFile={uploadedFile}/>
        )}
      </UploadedFilesContainer>
    </Root>
  )
}

const Root = styled.div({
  display: `flex`,
  flexDirection: `row`,
  gap: `40px`,
})

const UploadedFilesContainer = styled.div({
  display: `flex`,
  flexDirection: `column`,
  gap: `10px`,
  flex: `50%`
})

const StyledUploadIcon = styled.img({
  margin: `0 8px`,
  height: `20%`,
});

const DropZoneDiv = styled.div({
  display: `flex`,
  flex: `50%`,
  height: `50vh`,
  padding: 0,
  alignItems: `center`,
  justifyContent: `center`,
  flexDirection: `column`,
  boxSizing: `border-box`,
  fontFamily: `sans-serif`,
  border: `3px dashed #e0e0e0`,
  borderRadius: `15px`,
  userSelect: `none`,
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

const DropZoneTextContainer = styled.div({
  display: `flex`,
  flexDirection: `column`,
});

const Heading = styled.h3({
  margin: 0,
  marginBottom: `10px`,
})