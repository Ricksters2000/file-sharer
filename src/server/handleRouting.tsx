import * as fs from 'fs';
import { Request, Response } from "express";
import {ViteDevServer} from "vite";
import {fsPaths} from "../fsPaths";

export const handleRouting = (vite: ViteDevServer) => async (req: Request, res: Response) => {
  let template = fs.readFileSync(fsPaths.templateHtmlFile, 'utf-8')
  template = await vite.transformIndexHtml(req.url, template)
  const render = (await vite.ssrLoadModule('/src/server/renderServerHtml.tsx')).renderServerHtml
  const appHtml = render(req.url);
  const html = template.replace(`<!--app-html-->`, appHtml)
  res.set(`content-type`, `text/html`);
  res.send("<!DOCTYPE html>" + html);
}