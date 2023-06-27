import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';
import {App} from '../pages/home/App';

export type RenderFunc = (url: string) => string;

export const render: RenderFunc = (url) => {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}