import { useEventListener } from 'ahooks';
import useDomId from './useDomId';

const isInnerContainer = (selector: string, target: EventTarget | null) => {
  const judgeDOM = document.querySelector(selector);
  return !!judgeDOM && !!target && judgeDOM.contains(target as HTMLElement);
};

export default (onClickAway: () => void) => {
  const classId = useDomId();
  const dropdownCls = `bitspark-id-${classId}`;

  useEventListener('click', (e: MouseEvent) => {
    const isInner = isInnerContainer(`.${dropdownCls}`, e.target);
    !isInner && onClickAway();
  }, {
    target: document.body
  });

  return dropdownCls;
}