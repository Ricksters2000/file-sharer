import {RouteObject} from 'react-router-dom';
import DummyApp from './pages/home/DummyApp';

export const routes: Array<RouteObject> = [
  {
    path: `/`,
    Component: DummyApp
  }
]