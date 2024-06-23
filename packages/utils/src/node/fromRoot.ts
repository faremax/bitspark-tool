import path from 'path';
import readPackage from './readPackage';

export default (...p: string[]) => {
  const appDirectory = path.dirname(readPackage().path);
  return path.join(appDirectory, ...p);
}