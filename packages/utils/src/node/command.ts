import { exec, execSync } from 'child_process';
import createDebug from './createDebug';
import getCwd from './getCwd';

const { log } = createDebug('*');

interface ExecParams {
  cmd: string;
  cwd?: string;
}

export const commandAsync = (params: ExecParams) => {
  return new Promise(res => {
    exec(params.cmd, {
      cwd: params.cwd || getCwd(),
      env: process.env
    }, (err, stdout, stderr) => {
      if(err) {
        log('error', err);
        process.exit();
      }

      if(stdout || stderr) {
        log('standout', stdout || stderr);
      }

      res(stdout || stderr);
    })
  })
}

export default (params: ExecParams) => execSync(params.cmd, {
  cwd: params.cwd || process.cwd(),
  env: process.env
})