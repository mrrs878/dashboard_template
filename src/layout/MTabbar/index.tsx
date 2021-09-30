/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-30 16:44:07
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-09-30 17:57:23
 * @FilePath: \dashboard_template\src\layout\MTabbar\index.tsx
 */
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import style from './index.module.less';

const CloseCircleOutlined = () => (
  <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2399" width="18" height="18">
    <path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z" p-id="2400" />
    <path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z" p-id="2401" />
  </svg>
);

function insertBefore<T>(list: T[], from: T, to?: T): T[] {
  const copy = [...list];
  const fromIndex = copy.indexOf(from);
  if (from === to) {
    return copy;
  }
  copy.splice(fromIndex, 1);
  const newToIndex = to ? copy.indexOf(to) : -1;
  if (to && newToIndex >= 0) {
    copy.splice(newToIndex, 0, from);
  } else {
    // 没有 To 或 To 不在序列里，将元素移动到末尾
    copy.push(from);
  }
  return copy;
}

function isEqualBy<T>(a: T[], b: T[], key: keyof T) {
  const aList = a.map((item) => item[key]);
  const bList = b.map((item) => item[key]);

  let flag = true;
  aList.forEach((i, idx) => {
    if (i !== bList[idx]) {
      flag = false;
    }
  });
  return flag;
}

interface ITag {
  path: string;
  title: string;
}

interface IMTagsBarProps {
  tags: Array<ITag>;
  activeTag: string;
  updateTags: (tags: Array<ITag>) => void;
  onTagChange?: (path: string, index: number) => void;
}

interface IPosition {
  x: number;
  y: number;
}

enum ContextMenuKeys {
  close = 'close',
  closeOthers = 'closeOthers',
  closeAll = 'closeAll',
}

type ContextMenuClickHandler = (
  pre: Array<ITag>,
  contextMenuTag: string
) => Array<ITag>;

const ContextMenuClickHandlers: Record<
ContextMenuKeys,
ContextMenuClickHandler
> = {
  [ContextMenuKeys.close]: (pre, contextMenuTag) => pre.filter(
    (item) => item.path !== contextMenuTag,
  ),
  [ContextMenuKeys.closeAll]: () => [],
  [ContextMenuKeys.closeOthers]: (pre, contextMenuTag) => pre.filter(
    (item) => item.path === contextMenuTag,
  ),
};

const TAG_WIDTH = 120;

let originTagPos: IPosition = { x: 0, y: 0 };
let originMousePos: IPosition = { x: 0, y: 0 };

const MTagsBar = (props: IMTagsBarProps) => {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuTag, setContextMenuTag] = useState('');
  const [contextMenuPos, setContextMenuPos] = useState<IPosition>({ x: 0, y: 0 });
  const [currentTag] = useState(props.activeTag || props.tags[0]?.path);
  const [movingTagPos, setMovingTagPos] = useState<IPosition>({ x: 0, y: 0 });
  const movingTagPath = useRef<string>('');
  const contentDivRef = useRef<HTMLDivElement>(null);

  const onTagClick = useCallback((e, path, index) => {
    // setTimeout(props.history.replace, 100, path);
    props.onTagChange?.call(null, path, index);
    console.log(path);
  }, [props]);

  const onTagCloseClick = useCallback((e, path) => {
    e.preventDefault();
    e.stopPropagation();
    const newTags = props.tags.filter((item) => item.path !== path);
    props.updateTags(newTags);
  }, [props]);

  const onTagContextMenu = useCallback((e, path) => {
    e.preventDefault();
    setContextMenuVisible(true);
    setContextMenuPos({ x: e.pageX, y: 20 });
    setContextMenuTag(path);
  }, []);

  const onTagMouseMove = useCallback((e) => {
    e.preventDefault();
    const contentWidth = (contentDivRef.current?.getBoundingClientRect().width || 0);
    const contentLeft = (contentDivRef.current?.getBoundingClientRect().left || 0);
    const threshold = (contentLeft + (TAG_WIDTH / 2));
    if (e.pageX < threshold) {
      setMovingTagPos({ x: 0, y: 0 });
      return;
    }
    let x = e.pageX - originMousePos.x + originTagPos.x;
    x = x > contentWidth - threshold ? contentWidth - threshold : x;
    setMovingTagPos({ x, y: 0 });
  }, []);
  const onTagMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', onTagMouseMove);
    document.removeEventListener('mouseup', onTagMouseUp);
    setMovingTagPos({ x: 0, y: 0 });
    movingTagPath.current = '';
  }, [onTagMouseMove]);
  const onTagMouseDown = useCallback(async (e, path) => {
    e.preventDefault();
    movingTagPath.current = path;
    const x = (parseInt(e.currentTarget.style.left, 10) || 0);
    originMousePos = { x: e.pageX, y: 0 };
    originTagPos = ({ x, y: 0 });
    const activeTag = contentDivRef.current?.querySelectorAll(`.${style.active}`) || [];
    Array.from(activeTag)?.forEach((item) => item.classList.remove(style.active));
    e.currentTarget?.classList.add(style.active);
    e.currentTarget?.classList.add(style.moving);
    setMovingTagPos({ x: 0, y: 0 });
    document.addEventListener('mousemove', onTagMouseMove);
    document.addEventListener('mouseup', onTagMouseUp);
  }, [onTagMouseMove, onTagMouseUp]);

  const onDocumentClick = useCallback(() => {
    setContextMenuVisible(false);
  }, []);

  const onContextMenuClick = useCallback(
    (e) => {
      const composedPath = e.nativeEvent?.composedPath();
      const target = composedPath.find((item: any) => item.className?.includes('menuItem'));
      const getNewTags = () => {
        const preTags = props.tags;
        const key: ContextMenuKeys = target?.dataset?.key;
        const newTags = ContextMenuClickHandlers[key](preTags, contextMenuTag);
        return newTags;
      };
      props.updateTags(getNewTags());
    },
    [contextMenuTag, props],
  );

  const updateTags = useCallback((clientX: number) => {
    const dropRect = contentDivRef.current?.getBoundingClientRect();
    if (dropRect && movingTagPath.current) {
      const offsetX = clientX - dropRect.left;
      const dragItem = props.tags.find((item) => item.path === movingTagPath.current) || { path: '', title: '' };
      const col = Math.floor(offsetX / TAG_WIDTH);
      let currentIndex = col;
      const fromIndex = props.tags.indexOf(dragItem);
      if (fromIndex < currentIndex) {
        currentIndex += 1;
      }
      const currentItem = props.tags[currentIndex];
      const ordered = insertBefore(props.tags, dragItem, currentItem);
      if (isEqualBy(ordered, props.tags, 'path')) return;
      if (fromIndex < currentIndex) {
        originMousePos.x += TAG_WIDTH;
      } else {
        originMousePos.x -= TAG_WIDTH;
      }
      props.updateTags(ordered);
    }
  }, [props]);

  const onTagOver = useCallback((e) => {
    e.preventDefault();
    updateTags(e.clientX);
  }, [updateTags]);

  useEffect(() => {
    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [onDocumentClick]);

  return (
    <>
      {props.tags.length > 0 && (
        <div className={style.container}>
          <div className={style.top} />
          <div
            className={style.content}
            ref={contentDivRef}
            onMouseMove={onTagOver}
          >
            {props.tags.map((tag, index) => (
              <div
                onClick={(e) => onTagClick(e, tag.path, index)}
                onContextMenu={(e) => onTagContextMenu(e, tag.path)}
                onMouseDown={(e) => onTagMouseDown(e, tag.path)}
                key={tag.path}
                data-path={tag.path}
                className={`${style.tagC} ${currentTag === tag.path ? style.active : ''}`}
                style={{ left: movingTagPath.current === tag.path ? movingTagPos.x : 'unset' }}
              >
                <span className={style.tagText}>
                  {tag.title}
                </span>
                <span
                  className={style.tagClose}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => onTagCloseClick(e, tag.path)}
                >
                  <CloseCircleOutlined />
                </span>
              </div>
            ))}
          </div>
          <div className={style.bottom} />
          {contextMenuVisible && (
            <ul
              className={style.menu}
              style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
              onClick={onContextMenuClick}
            >
              <li data-key={ContextMenuKeys.close} className={style.menuItem}>
                关闭当前
              </li>
              <li data-key={ContextMenuKeys.closeOthers} className={style.menuItem}>
                关闭其他
              </li>
              <li data-key={ContextMenuKeys.closeAll} className={style.menuItem}>
                关闭所有
              </li>
            </ul>
          )}
        </div>
      )}
    </>
  );
};

const updateActiveTag = (preIndex: number, tags: Array<ITag>) => {
  if (tags.length === 0) return '';
  if (preIndex === tags.length) return tags[preIndex - 1].path;
  return tags[preIndex].path;
};

export { MTagsBar, updateActiveTag };
