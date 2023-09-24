// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname']
import ReactDOMServer from 'react-dom/server'
import {escapeInject, dangerouslySkipEscape} from 'vite-plugin-ssr/server'
import {PageContextBuiltInServer} from 'vite-plugin-ssr/types'
import {bodyId} from '../elementIds'

export const render = (pageContext: PageContextBuiltInServer<React.FC<{}>>) => {
  const {Page} = pageContext
  // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
  if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined')
  const pageHtml = ReactDOMServer.renderToString(
    <Page/>
  )

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${`logoUrl`}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${`desc`}" />
        <title>File Sharer</title>
      </head>
      <body>
        <div id="${bodyId}">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
  }
}