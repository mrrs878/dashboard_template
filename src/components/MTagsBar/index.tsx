/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-29 09:58:37
 * @LastEditTime: 2021-03-30 23:42:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/components/MTagsView/index.tsx
 */
import { CloseCircleOutlined } from '@ant-design/icons';
import { uniqBy } from 'ramda';
import React, {
  useCallback, useEffect, useState,
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
  const [tagMoving, setTagMoving] = useState(false);
  const [originTagPos, setOriginTagPos] = useState<IPosition>({ x: 0, y: 0 });
  const [movingTagPos, setMovingTagPos] = useState<IPosition>({ x: 0, y: 0 });

  const onTagClick = useCallback((path) => {
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

  const onTagMouseDown = useCallback((e) => {
    e.preventDefault();
    setOriginTagPos({ x: e.pageX, y: 0 });
    setTagMoving(true);
  }, []);
  const onTagMouseMove = useCallback((e: any) => {
    e.preventDefault();
    const x = e.pageX - originTagPos.x;
    if (tagMoving) setMovingTagPos({ x: x < 0 ? 0 : x, y: 0 });
  }, [tagMoving, originTagPos]);
  const onTagMouseUp = useCallback(() => {
    setTagMoving(false);
  }, []);

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

  useEffect(() => {
    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [onDocumentClick]);
  useEffect(() => {
    document.addEventListener('mouseup', onTagMouseUp);
    return () => {
      document.removeEventListener('mouseup', onTagMouseUp);
    };
  }, [onTagMouseUp]);
  useEffect(() => {
    document.addEventListener('mousemove', (e) => onTagMouseMove(e));
    return () => {
      document.removeEventListener('mousemove', (e) => onTagMouseMove(e));
    };
  }, [onTagMouseMove]);

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
          <div className={style.content}>
            {tags.map((tag, index) => (
              <div
                onClick={() => onTagClick(tag.path)}
                onContextMenu={(e) => onTagContextMenu(e, tag.path)}
                onMouseDown={(e) => onTagMouseDown(e)}
                key={tag.path}
                className={`${style.tagC} ${currentTag === tag.path ? style.active : ''}`}
                style={{ left: currentTag === tag.path ? movingTagPos.x : 'unset' }}
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
