import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DummyApp from './DummyApp';
import { Navigation } from '../Navigation';
import { Upload } from '../upload/Upload';

export const App: React.FC<unknown> = () => {
  return (
    <Routes>
      <Route path='/' element={<Upload/>}/>
    </Routes>
  )
}