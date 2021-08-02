/*
* @Author: mrrs878@foxmail.com
* @Date: 2021-08-02 17:45:42
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-02 21:04:10
 * @FilePath: d:\Data\Personal\MyPro\dashboard_template\src\hook\useKeepScroll.ts
* @Description:
*/
import { useEffect, useRef } from 'react';

interface IConfig {
  key: string;
}

const useKeepScroll = (container = window, config: IConfig) => {
  const cancel = () => {};
  const position = useRef({ left: 0, top: 0 });

  useEffect(() => {
    container.addEventListener('scroll', () => {
      position.current = ({ left: container.scrollX, top: container.scrollY });
    });
  }, [container]);

  useEffect(() => {
    const c = container;
    console.log(document.querySelector('#permission'));

    const prePosition = window.localStorage.getItem(config.key) || '{ "left": 0, "top": 0 }';
    console.log(prePosition);
    c?.scrollTo(JSON.parse(prePosition));

    return () => {
      window.localStorage.setItem(config.key, JSON.stringify(position.current));
    };
  }, [config.key, container]);

  return [
    cancel,
  ];
};

export default useKeepScroll;
