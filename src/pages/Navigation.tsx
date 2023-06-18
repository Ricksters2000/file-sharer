import React from 'react';
import styled from '@emotion/styled';

export const Navigation: React.FC<unknown> = (props) => {
  return (
    <Nav>
      <div>
        <div>
          FileSharer
        </div>
        <div>
          Upload
        </div>
        <div>
          Download
        </div>
      </div>
    </Nav>
  )
}

const Nav = styled.nav({
  display: `flex`,
})

const Container = styled.div({
  width: `25%`,
  display: `flex`,
  justifyContent: `space-between`,
})