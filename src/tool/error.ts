/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-21 15:16:48
 * @LastEditTime: 2021-04-21 19:02:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/tool/error.ts
 */

enum ErrorTypes {
  'PromiseError' = 'PromiseError',
  'AssetsError' = 'AssetsError',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getLastEvent(): undefined|Event {
  let lastEvent;
  ['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach((eventType) => document.addEventListener(eventType, (event) => {
    lastEvent = event;
  }, {
    capture: true,
    passive: true,
  }));
  return lastEvent;
}

function getLines(stack: string|undefined) {
  return stack?.split('\n').slice(1).map((item) => item.replace(/^\s+at\s+/g, '')).join('') || '';
}

function getBaseInfoFromEvent(errorType: ErrorTypes): IBaseErrorInfo {
  return {
    title: document.title.replace(/&/, ''),
    location: document.location.href.replace(/&/, ''),
    kind: 'stability',
    type: 'error',
    errorType,
  };
}

function report<T>(info: T) {
  console.log(info);
  const image = new Image();
  image.src = '1';
}

function promiseError() {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    event.preventDefault();
    let message = '';
    let stack = '';
    const { reason } = event;
    message = reason;
    if (reason instanceof Error) {
      message = reason.message;
      stack = getLines(reason.stack);
    }

    report<IPromiseError>({
      message, stack, ...getBaseInfoFromEvent(ErrorTypes.PromiseError),
    });
  });
}

function init() {
  promiseError();
}

export default init;
