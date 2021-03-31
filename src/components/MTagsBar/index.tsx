/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-29 09:58:37
 * @LastEditTime: 2021-03-31 23:08:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/components/MTagsView/index.tsx
 */
import { CloseCircleOutlined } from '@ant-design/icons';
import { uniqBy } from 'ramda';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useModel } from '../../store';
import style from './index.module.less';

interface IMTagsBarProps extends RouteComponentProps {}

interface ITag {
  path: string;
  title: string;
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

let originTagPos: IPosition = { x: 0, y: 0 };
let originMousePos: IPosition = { x: 0, y: 0 };

const MTagsBar = (props: IMTagsBarProps) => {
  const [menuTitles] = useModel('menuTitles');
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuTag, setContextMenuTag] = useState('');
  const [contextMenuPos, setContextMenuPos] = useState<IPosition>({
    x: 0,
    y: 0,
  });
  const [tags, setTags] = useState<Array<ITag>>([]);
  const [currentTag, setCurrentTag] = useState(tags[0]?.path);
  const [movingTagPos, setMovingTagPos] = useState<IPosition>({ x: 0, y: 0 });
  const [movingTag, setMovingTag] = useState('');
  const contentDivRef = useRef<HTMLDivElement>(null);
  const dragTagPath = useRef<string>('');

  const onTagClick = useCallback((e, path) => {
    setCurrentTag(path);
  }, []);

  const onTagCloseClick = useCallback((e, path, index) => {
    e.stopPropagation();
    setTags((preTags) => {
      const newTags = preTags.filter((item) => item.path !== path);
      setCurrentTag((prePath) => (newTags.findIndex((item) => item.path === prePath) !== -1
        ? prePath
        : preTags[index === preTags.length - 1 ? index - 1 : index + 1].path));
      return newTags;
    });
  }, []);

  const onTagContextMenu = useCallback((e, path) => {
    e.preventDefault();
    setContextMenuVisible(true);
    setContextMenuPos({ x: e.pageX, y: 20 });
    setContextMenuTag(path);
  }, []);

  const onTagMouseMove = useCallback((e) => {
    e.preventDefault();
    console.log(movingTag);

    const contentWidth = (contentDivRef.current?.getBoundingClientRect().width || 0) - 140;
    console.log(e.pageX - originMousePos.x);
    let x = e.pageX - originMousePos.x + originTagPos.x;
    x = x < 0 ? 0 : x;
    x = x > contentWidth ? contentWidth : x;
    setMovingTagPos(() => ({ x, y: 0 }));
  }, [movingTag]);
  const onTagMouseUp = useCallback((e) => {
    document.removeEventListener('mousemove', onTagMouseMove);
    document.removeEventListener('mouseup', onTagMouseUp);
    console.log(e.currentTarget.offsetLeft);
    // eslint-disable-next-line no-bitwise
    const x = ((e.target.parentElement.offsetLeft / 140) >> 0) * 140;
    setMovingTagPos(() => ({ x, y: 0 }));
  }, [onTagMouseMove]);
  const onTagMouseDown = useCallback((e, path) => {
    e.preventDefault();
    console.log(e.currentTarget);

    const x = (parseInt(e.currentTarget.style.left, 10) || 0);
    originMousePos = { x: e.pageX, y: 0 };
    originTagPos = ({ x, y: 0 });
    setMovingTag(path);
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
    [contextMenuTag],
  );

  const onTagDragStart = useCallback((e, path) => {
    console.log(e.currentTarget);
    dragTagPath.current = path;
    const el = contentDivRef.current?.querySelector(`[data-path="${path}"]`);
    el?.classList.add(style.dragging);
  }, []);
  const onTagDragEnd = useCallback((e) => {
    console.log(e.currentTarget);
    const el = contentDivRef.current?.querySelector(`[data-path="${dragTagPath.current}"]`);
    el?.classList.remove(style.dragging);
    dragTagPath.current = '';
  }, []);
  const onTagDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [onDocumentClick]);

  useEffect(() => {
    const path = props.location.pathname;
    setTags((pre) => uniqBy(
      (item) => item.path,
      [...pre, { path, title: menuTitles[path] }].filter(({ title }) => title !== undefined),
    ));
    setCurrentTag(path);
  }, [menuTitles, props.location.pathname]);

  return (
    <>
      {tags.length > 0 && (
        <div className={style.container}>
          <div className={style.top} />
          <div
            className={style.content}
            ref={contentDivRef}
            onDragOver={onTagDragOver}
            onDragEnd={onTagDragEnd}
          >
            {tags.map((tag, index) => (
              <div
                onClick={(e) => onTagClick(e, tag.path)}
                onContextMenu={(e) => onTagContextMenu(e, tag.path)}
                onMouseDown={(e) => onTagMouseDown(e, tag.path)}
                onDragStart={(e) => onTagDragStart(e, tag.path)}
                key={tag.path}
                draggable
                data-path={tag.path}
                className={`${style.tagC} ${currentTag === tag.path ? style.active : ''} ${dragTagPath.current === tag.path ? style.dragging : ''}`}
                style={{ left: dragTagPath.current === tag.path ? movingTagPos.x : 'unset' }}
              >
                <span className={style.tagText}>{tag.title}</span>
                <span
                  className={style.tagClose}
                  onClick={(e) => onTagCloseClick(e, tag.path, index)}
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
