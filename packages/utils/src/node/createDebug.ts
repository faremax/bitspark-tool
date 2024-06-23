import debug from 'debug';

const createDebug = (name: string) => ({
  log: debug(`${name}:standard`),
  input: debug(`${name}:input`),
  output: debug(`${name}:output`)
});

createDebug.enable = debug.enable;

export default createDebug;

