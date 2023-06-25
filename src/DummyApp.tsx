import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import styled from '@emotion/styled'

const DummyApp: React.FC<any> = () => {
  const [count, setCount] = React.useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <Logo src={viteLogo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <ReactLogo src={reactLogo} alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Card>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </Card>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

const Logo = styled.img({
  height: `6em`,
  padding: `1.5em`,
  willChange: `filter`,
  transition: `filter 300ms`,
  ":hover": {
    filter: `drop-shadow(0 0 2em #646cffaa)`,
  },
});

const ReactLogo = styled.img(theme => ({
  ":hover": {
    filter: `drop-shadow(0 0 2em #61dafbaa)`
  },
  color: theme.color
})).withComponent(Logo);

const Card = styled(`div`)`
  padding: .2em;
`

export default DummyApp
