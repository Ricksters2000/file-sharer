import React from 'react'
import ReactDOM from 'react-dom/client'
import {bodyId} from '../elementIds'
import {Upload} from '../pages/upload/Upload'
import {PageContextBuiltInClientWithServerRouting} from 'vite-plugin-ssr/types'

export const render = async (pageContext: PageContextBuiltInClientWithServerRouting) => {
  const {Page} = pageContext
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined')
  const root = document.getElementById(bodyId)
  if (!root) throw new Error(`DOM element #${bodyId} not found`)
  ReactDOM.hydrateRoot(root,
    <Page/>
  )
}