import { createElement, useCallback, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { useLocalStorageState } from 'ahooks';
import renderToBody from './render-to-body';

export interface PromisifyProps<V = unknown> {
  onResolve: (value: V) => void;
  onReject: (error: unknown) => void;
}

export interface UseMaskProps extends PromisifyProps {
  [key: string]: any;
  [key: number]: any;
}

const useMask = <T>(props: UseMaskProps) => {
  const { onResolve, onReject } = props;
  const [visible, setVisible] = useLocalStorageState<boolean>('BITSPARK__PAGE_HAS_MASK', {
    defaultValue: false
  });

  const value = useRef<T | null>();
  const error = useRef<unknown | null>();

  useEffect(() => {
    setVisible(true);
  }, []);

  const resolve = useCallback((val?: T) => {
    value.current = val;
    setVisible(false);
  }, []);

  const reject = useCallback((err?: unknown) => {
    error.current = err;
    setVisible(false);
  }, []);

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const afterClose = useCallback(() => {
    value.current ? onResolve?.(value.current) : onReject?.(error.current);
  }, [onReject, onResolve]);

  return {
    destoryOnClose: true,
    visible,
    onCancel,
    afterClose,
    resolve,
    reject
  };
};

const promisify = <T, R>(Component: ComponentType<T & PromisifyProps<R>>, throwWhenError = false) => {
  return (props: T) => {
    let resolve: PromisifyProps['onResolve'] | null = null;
    let reject: PromisifyProps['onReject'] | null = null;
    let closeFn: (() => void) | null = null;

    const cancel = () => {
      closeFn?.();
      resolve = reject = null;
    };

    const onResolve = (value: R) => {
      resolve?.(value);
      cancel();
    };

    const onReject = (error: unknown) => {
      reject?.(error);
      cancel();
    };

    const promise = new Promise<R | unknown>((res, rej) => {
      resolve = res;
      reject = rej;

      closeFn = renderToBody(createElement(Component, {
        ...props,
        onResolve,
        onReject
      }));
    });

    throwWhenError || promise.catch(err => err);
    return promise;
  };
};

promisify.useMask = useMask;
export default promisify;