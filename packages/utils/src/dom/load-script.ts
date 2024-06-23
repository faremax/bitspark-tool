interface Options {
  onLoad?: () => void;
  onError?: () => void;
}

export default (url: string, options?: Options) => {
  const { onLoad, onError } = options || {};
  const el = document.createElement('script');
  el.charset = 'utf-8';
  el.onload = () => {
    el.onload = null;
    onLoad?.();
  };
  el.onerror = () => {
    el.onerror = null;
    onError?.();
  };
  document.body.appendChild(el);
  el.src = url;
}