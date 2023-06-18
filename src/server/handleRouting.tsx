import { Request, Response } from "express";
import {StaticRouter} from 'react-router-dom/server';
import ReactDOMServer from 'react-dom/server';
import { App } from "../App";
import { AppTemplate } from "./AppTemplate";

export const handleRouting = (req: Request, res: Response) => {
  const jsx = (
    <AppTemplate>
      <StaticRouter location={req.url}>
        <App/>
      </StaticRouter>
    </AppTemplate>
  )
  const html = ReactDOMServer.renderToString(jsx)
  res.set(`content-type`, `text/html`);
  res.send("<!DOCTYPE html>" + html);
}