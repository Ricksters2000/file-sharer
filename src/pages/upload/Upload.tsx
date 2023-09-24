import styled from '@emotion/styled';
import React, {useCallback} from 'react';
// @ts-ignore
import {DropEvent, FileRejection, useDropzone} from 'react-dropzone';
import {UploadedFile} from './UploadedFile';
import FolderUploadIcon from '../../assets/folder-upload-icon.svg';
import {mediauQueries} from '../../utils/mediaQueries';

type OnDropCallback = <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void
export const Upload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState<Array<Blob>>([])
  const onDrop = useCallback<OnDropCallback>(async (acceptedFiles) =>  {
    console.log(acceptedFiles)
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  return (
    <Root>
      <Title>File Uploader</Title>
      <SubTitle>Upload documents you want to share with others</SubTitle>
      <UploadContainer>
        <DropZoneDiv {...getRootProps()}>
          <input {...getInputProps()}/>
          <StyledUploadIcon src={FolderUploadIcon}/>
          {
            isDragActive ?
              <DropZoneText>Drop the files here ...</DropZoneText> :
              <DropZoneText>Drag 'n' drop some files here, or click to select files</DropZoneText>
          }
          <DropZoneText>- OR -</DropZoneText>
          <ButtonWrapper>
            <DropZoneButton>Browse Files</DropZoneButton>
          </ButtonWrapper>
        </DropZoneDiv>
        <UploadedFilesContainer>
          <Heading>{uploadedFiles.length === 0 ? `No Files Uploaded...` : `Uploaded Files`}</Heading>
          {uploadedFiles.map((uploadedFile, i) =>
            <UploadedFile key={`${uploadedFile.name}-${i}`} localFile={uploadedFile}/>
          )}
        </UploadedFilesContainer>
      </UploadContainer>
    </Root>
  )
}

const Root = styled.div({
})

const Title = styled.h1({
  color: `#50b595`,
  margin: 0,
})

const SubTitle = styled.p({
  color: `#767676`,
  fontSize: `20px`,
  marginTop: `10px`,
  marginBottom: `40px`,
})

const UploadContainer = styled.div({
  display: `flex`,
  flexDirection: `row`,
  gap: `40px`,
  [mediauQueries.mediumAndBelow]: {
    flexDirection: `column`,
    gap: `20px`,
  },
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

const DropZoneButton = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `solid 1px`,
  borderRadius: `12px`,
  background: `white`,
  borderColor: `#50b595`,
  color: `#50b595`,
  width: `150px`,
  height: `45px`,
  transition: `0.2s`,
})

const DropZoneDiv = styled.div({
  display: `flex`,
  gap: `10px`,
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
    borderColor: `#50b595`,
    color: `black`,
  },
  [`&:hover ${DropZoneButton}`]: {
    background: `#50b595`,
    color: `white`,
  },
  [mediauQueries.largest]: {
    flex: `50%`,
  },
  [mediauQueries.mediumAndBelow]: {
    height: `200px`,
    padding: `16px`,
  },
});

const DropZoneTextContainer = styled.div({
  display: `flex`,
  flexDirection: `column`,
});

const DropZoneText = styled.p({
  margin: 0,
  fontSize: `18px`,
  color: `#50b595`
})

const ButtonWrapper = styled.div({
  width: `100%`
})

const Heading = styled.h3({
  margin: 0,
  marginBottom: `10px`,
  [mediauQueries.mediumAndBelow]: {
    display: `none`,
  },
})