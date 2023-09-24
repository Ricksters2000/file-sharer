import {NextFunction, Request, Response} from "express";
import {ViteDevServer} from "vite";
import {renderPage} from 'vite-plugin-ssr/server';

export const handleRouting = (vite?: ViteDevServer) => async (req: Request, res: Response, next: NextFunction) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl
  }
  const pageContext = await renderPage(pageContextInit)
  if (!pageContext.httpResponse) {
    return next();
  }
  const {body, statusCode, headers, earlyHints} = pageContext.httpResponse
  res.writeEarlyHints({link: earlyHints.map(e => e.earlyHintLink)})
  headers.forEach(([name, value]) => res.setHeader(name, value))
  res.status(statusCode)
  res.send(body)
}