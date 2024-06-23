export default (obj: Record<string, string> = {}, target = document.documentElement) => {
  Object.keys(obj).forEach(key => {
    if(!obj[key]) return;
    const _key = /^--/.test(key) ? key : `--${key}`;
    target.style.setProperty(_key, obj[key]);
  });
};