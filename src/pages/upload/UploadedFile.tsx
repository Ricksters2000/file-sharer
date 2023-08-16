import React from 'react';
import {FileProgress} from '../../assetManagement/UploadProgressManager';
import styled from '@emotion/styled';
import {LinearProgress} from '@mui/material';
import {generateRandomNumber} from '../../utils/generateRandomNumber';
import {ProgressStatus, ProgressStatusAction} from '../../assetManagement/types';
import FileIcon from '../../assets/file-icon.svg';

export type FileProgressWithData = {
  fileProgress: FileProgress;
  filename: string;
  downloadLink?: string;
}

type Props = {
  fileProgressWithData?: FileProgressWithData;
  localFile: Blob;
}

export const UploadedFile: React.FC<Props> = (props) => {
  const {localFile} = props;
  const [uploadProgress, setUploadProgress] = React.useState<number>(-1);
  const [maxProgress, setMaxProgress] = React.useState<number>(-1);
  const [progressStatus, setProgressStatus] = React.useState<ProgressStatus>(ProgressStatus.UNKNOWN);
  const [id, setId] = React.useState(-1);
  const [downloadLink, setDownloadLink] = React.useState(``);
  const filename = localFile.name;
  let currentProgress: number | undefined
  if (progressStatus === ProgressStatus.ONGOING) {
    currentProgress = uploadProgress && Math.round(uploadProgress / maxProgress * 100)
  } else if (progressStatus === ProgressStatus.COMPLETED) {
    currentProgress = 100
  }

  React.useEffect(() => {
    (async () => {
      const generatedId = generateRandomNumber();
      setId(generatedId);
      const formData = new FormData();
      formData.append(`files`, localFile);
      const progressEvent = new EventSource(`/api/progress/${generatedId}`)
      progressEvent.onmessage = (event) => {
        if (!event.data) {
          console.warn(`Data is undefined from progress event:`, event)
          return
        }
        if (progressStatus === ProgressStatus.CANCELED) {
          progressEvent.close()
          return
        }
        const progressStatusAction = JSON.parse(event.data) as ProgressStatusAction
        // console.log(`data:`, progressStatusAction)
        setProgressStatus(prev => {
          if (prev === progressStatusAction.type) return prev
          return progressStatusAction.type
        })
        if (progressStatusAction.type === ProgressStatus.COMPLETED) {
          setUploadProgress(maxProgress)
          progressEvent.close()
          return
        }
        if (progressStatusAction.type !== ProgressStatus.ONGOING) {
          console.warn(`Progress status action type is undefined or unexpected value:`, progressStatusAction)
          return
        }
        const progress = progressStatusAction.data
        if (maxProgress === -1) {
          setMaxProgress(progress.maxProgress)
        }
        setUploadProgress(progress.currentProgress)
        if (progress.currentProgress >= progress.maxProgress) {
          console.log(`done`)
          progressEvent.close()
        }
      }
      const res = await fetch(`/api/upload/${generatedId}`, {
        method: `post`,
        body: formData,
      });
      const data = await res.text();
      setDownloadLink(data);
    })()
  }, [])

  const cancelUpload = async () => {
    try {
      console.log(`start cancel upload`)
      const res = await fetch(`api/cancel/${id}`, {
        method: `put`,
      })
      setProgressStatus(ProgressStatus.CANCELED)
    } catch (err) {
      console.warn(`Error canceling upload: ${err}`)
    }
  }

  return (
    <Root>
      <Container>
        <StyledFileIcon src={FileIcon}/>
        <ProgressContainer>
          <TextContainer>
            <FilenameContainer>
              <Text>{filename}</Text>
              {currentProgress && <Text>({currentProgress}%)</Text>}
            </FilenameContainer>
            {progressStatus === ProgressStatus.COMPLETED ?
              <Text style={{color: `#2fbf96`}}>Completed</Text>
            :
              <CancelText onClick={cancelUpload}>Cancel</CancelText>
            }
          </TextContainer>
          <ProgressBar color='inherit' variant={progressStatus === ProgressStatus.UNKNOWN ? `indeterminate` : `determinate`} value={currentProgress}/>
        </ProgressContainer>
      </Container>
    </Root>
  )
}

const Root = styled.div({
  padding: '2px 4px',
  background: '#e9e9e9',
})

const Container = styled.div({
  display: `flex`,
  alignItems: `center`,
  padding: '12px',
  background: `white`,
})

const ProgressContainer = styled.div({
  display: `flex`,
  flexDirection: `column`,
  width: `100%`,
  gap: `4px`,
})

const ProgressBar = styled(LinearProgress)({
  borderRadius: `8px`,
  color: `#2fbf96`
})

const TextContainer = styled.div({
  display: `flex`,
  justifyContent: `space-between`,
})

const FilenameContainer = styled.span({
  display: `inline-flex`,
  gap: `2px`,
  color: `#767676`,
})

const Text = styled.span({
})

const CancelText = styled(Text)({
  ':hover': {
    cursor: `pointer`,
  }
})

const StyledFileIcon = styled.img({
  height: '40px',
  width: '40px',
  marginRight: '8px',
})