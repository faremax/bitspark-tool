import { join, isAbsolute } from 'path';

export default () => {
  const cwd = process.cwd();
  if(process.env.APP_ROOT) {
    return isAbsolute(process.env.APP_ROOT) ? process.env.APP_ROOT : join(cwd, process.env.APP_ROOT);
  }

  return cwd
}