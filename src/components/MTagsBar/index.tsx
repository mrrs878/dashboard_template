/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-29 09:58:37
 * @LastEditTime: 2021-09-29 21:09:37
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\components\MTagsBar\index.tsx
 */
import { CloseCircleOutlined } from '@ant-design/icons';
import { last } from 'ramda';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useModel } from 'src/store';
import { insertBefore, isEqualBy } from 'src/tool';
import style from './index.module.less';

interface IMTagsBarProps extends RouteComponentProps {}

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
  const [tags, setTags] = useModel('tags');
  const [currentTag, setCurrentTag] = useState(tags[0]?.path);
  const [movingTagPos, setMovingTagPos] = useState<IPosition>({ x: 0, y: 0 });
  const movingTagPath = useRef<string>('');
  const contentDivRef = useRef<HTMLDivElement>(null);

  const onTagClick = useCallback((e, path) => {
    setCurrentTag(path);
    setTimeout(props.history.replace, 100, path);
  }, [props.history.replace]);

  const onTagCloseClick = useCallback((e, path) => {
    e.preventDefault();
    e.stopPropagation();
    setTags((preTags) => preTags.filter((item) => item.path !== path));
  }, [setTags]);

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
      setTags((preTags) => {
        const key: ContextMenuKeys = target?.dataset?.key;
        const index = preTags.findIndex((item) => item.path === contextMenuTag);
        const newTags = ContextMenuClickHandlers[key](preTags, contextMenuTag);
        setCurrentTag((prePath) => {
          if (newTags.length === 0) return '';
          if (key === ContextMenuKeys.closeOthers) return contextMenuTag;
          return newTags.findIndex((item) => item.path === prePath) !== -1
            ? prePath
            : preTags[index === preTags.length - 1 ? index - 1 : index + 1]
              .path;
        });
        return newTags;
      });
    },
    [contextMenuTag, setTags],
  );

  const updateTags = useCallback((clientX: number) => {
    const dropRect = contentDivRef.current?.getBoundingClientRect();
    if (dropRect && movingTagPath.current) {
      const offsetX = clientX - dropRect.left;
      const dragItem = tags.find((item) => item.path === movingTagPath.current) || { path: '', title: '' };
      const col = Math.floor(offsetX / TAG_WIDTH);
      let currentIndex = col;
      const fromIndex = tags.indexOf(dragItem);
      if (fromIndex < currentIndex) {
        currentIndex += 1;
      }
      const currentItem = tags[currentIndex];
      const ordered = insertBefore(tags, dragItem, currentItem);
      if (isEqualBy(ordered, tags, 'path')) return;
      if (fromIndex < currentIndex) {
        originMousePos.x += TAG_WIDTH;
      } else {
        originMousePos.x -= TAG_WIDTH;
      }
      setTags(ordered);
    }
  }, [setTags, tags]);

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

  useEffect(() => {
    const path = props.location.pathname;
    if (tags.map((item) => item.path).includes(path)) setCurrentTag(path);
  }, [props.location.pathname, tags]);

  useEffect(() => {
    if (tags.length > 0) {
      props.history.push(last(tags)?.path || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history.push, tags.length]);

  return (
    <>
      {tags.length > 0 && (
        <div className={style.container}>
          <div className={style.top} />
          <div
            className={style.content}
            ref={contentDivRef}
            onMouseMove={onTagOver}
          >
            {tags.map((tag) => (
              <div
                onClick={(e) => onTagClick(e, tag.path)}
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

export default withRouter(MTagsBar);
