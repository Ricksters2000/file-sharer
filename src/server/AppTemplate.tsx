import React, { ReactNode } from 'react';
import { bodyId } from '../elementIds';

type Props = {
  children: ReactNode;
}

export const AppTemplate: React.FC<Props> = (props) => {
  return (
    <html>
      <head>
        <title>File Sharer</title>
      </head>
      <body id={bodyId}>
        {props.children}
        {/* <script type="module">
          {`import RefreshRuntime from 'http://localhost:5173/@react-refresh'
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true`}
        </script> */}
        {/* <!-- if development --> */}
        <script type="module" src="/@vite/client"></script>
        {/* <script type="module" src="http://localhost:5173/main.js"></script> */}
        <script type="module" src='/main.js'></script>
      </body>
    </html>
  )
}