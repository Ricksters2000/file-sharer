import * as fs from 'fs';
import {Request, Response} from "express";
import {ViteDevServer} from "vite";
import {fsPaths} from "../fsPaths";
import {RenderFunc} from './serverSsrEntry';
import {isProduction} from '../utils/isProduction';

const indexProd = isProduction ? fs.readFileSync(fsPaths.templateHtmlFile.prod, `utf-8`) : null

export const handleRouting = (vite?: ViteDevServer) => async (req: Request, res: Response) => {
  let render: RenderFunc
  let template = indexProd
  if (!isProduction) {
    if (!vite) throw new Error(`Unexpected vite is not defined in development mode`)
    console.log(`getting index from path:`, fsPaths.templateHtmlFile.dev)
    const devScripts = fs.readFileSync(fsPaths.devScriptsHtmlFile, `utf-8`)
    template = fs.readFileSync(fsPaths.templateHtmlFile.dev, 'utf-8')
    template = template.replace(`<!--development-->`, devScripts)
    template = await vite.transformIndexHtml(req.url, template)
    render = (await vite.ssrLoadModule(fsPaths.serverSsrEntryFile)).render
  } else {
    // @ts-ignore
    render = (await import(`../../dist/server/server-ssr-entry.js`)).render
  }
  if (!template) throw new Error(`Index html file was not found`)
  const appHtml = render(req.url);
  const html = template.replace(`<!--app-html-->`, appHtml)
  res.set(`content-type`, `text/html`);
  res.send("<!DOCTYPE html>" + html);
}