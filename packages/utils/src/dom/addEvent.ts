type LegacyEvent = {
  attachEvent: (name: string, cb: (e: Event) => void) => void,
  [key: `on${string}`]: (e: Event) => void
}

export default (ele: HTMLElement & LegacyEvent, event: string, cb: (e: Event) => void) => {
  if(ele.addEventListener) {
    ele.addEventListener(event, cb, false);
  } else if(ele.attachEvent) {
    ele.attachEvent(`on${event}`, cb);
  } else {
    ele[`on${event}`] = cb;
  }
}