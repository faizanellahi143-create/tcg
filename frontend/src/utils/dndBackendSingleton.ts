import { HTML5Backend } from 'react-dnd-html5-backend';

let backendInstance: any = null;

export const getHTML5Backend = () => {
  if (!backendInstance) {
    backendInstance = HTML5Backend;
  }
  return backendInstance;
};