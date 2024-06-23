

import type { ReactElement } from 'react';
import * as ReactDOM from 'react-dom';
import type { Root } from 'react-dom/client';

type CreateRoot = (container: ContainerType) => Root

// Let compiler not to search module usage
const fullClone = {
  ...ReactDOM,
} as typeof ReactDOM & {
  render?: () => void;
  unmountComponentAtNode: () => void;
  createRoot?: CreateRoot
}

const { version, render: reactRender, unmountComponentAtNode } = fullClone;

let createRoot: CreateRoot;
try {
  const mainVersion = Number((version || '').split('.')[0]);
  if (mainVersion >= 18 && fullClone.createRoot) {
    createRoot = fullClone.createRoot;
  }
} catch (e) {
  // Do nothing;
}

const MARK = '__bitspark_root__'

// ========================== Render ==========================
type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root
}

function legacyRender(node: ReactElement, container: ContainerType) {
  reactRender(node, container);
}

function concurrentRender(node: ReactElement, container: ContainerType) {
  const root = container[MARK] || createRoot(container);
  root.render(node);
  container[MARK] = root;
}

function render(node: ReactElement, container: ContainerType) {
  if (createRoot as unknown) {
    return concurrentRender(node, container);
  }
  legacyRender(node, container);
}

// ========================== Unmount =========================
function legacyUnmount(container: ContainerType) {
  return unmountComponentAtNode(container);
}

async function concurrentUnmount(container: ContainerType) {
  // Delay to unmount to avoid React 18 sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount();
    delete container[MARK];
  });
}

function unmount(container: ContainerType) {
  if (createRoot as unknown) {
    return concurrentUnmount(container);
  }

  return legacyUnmount(container);
}

export default (element: ReactElement) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(element, container);

  return () => {
    const unmountResult = unmount(container);
    if (unmountResult && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };
}
