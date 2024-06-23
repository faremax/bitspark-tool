import path from 'path';
import fs from 'fs';
import { readPackageUpSync, type ReadResult } from 'read-pkg-up';

export default (cwd = process.cwd()) => {
  if(!cwd) throw new Error('read package: <cwd> is empty');

  const result: ReadResult | undefined = readPackageUpSync({
    cwd: fs.realpathSync(cwd)
  });

  if(!result) throw new Error(`read package: fail to read ${cwd}`);

  const { path: pkgPath } = result;
  const appDirectory = path.dirname(pkgPath);
  return {
    ...result,
    appDirectory
  };
}