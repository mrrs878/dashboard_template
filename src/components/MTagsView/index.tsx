/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-29 09:58:37
 * @LastEditTime: 2021-03-29 23:19:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/components/MTagsView/index.tsx
 */
import { CloseCircleOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { last, uniqBy } from 'ramda';
import React, {
  useCallback, useEffect, useState,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useModel } from '../../store';
import style from './index.module.less';
import useDeepCompareEffect from '../../hook/useDeepCompareEffect';

interface ITagView {
  path: string;
  title: string;
}

interface IMTagsViewProps extends RouteComponentProps {}

interface IContextMenuPosition {
  left: number;
  top: number;
}

const active: React.CSSProperties = {
  borderTopLeftRadius: '15px',
  borderTopRightRadius: '15px',
  backgroundColor: '#ddd',
};

enum ContextMenuKeys {
  close = 'close',
  closeOthers = 'closeOthers',
  closeAll = 'closeAll',
}

const MTagsView: React.FC<IMTagsViewProps> = (props: IMTagsViewProps) => {
  const [currentTag, setCurrentTag] = useState('');
  const [menuTitles] = useModel('menuTitles');
  const [contextMenuFlag, setContextMenuFlag] = useState(false);
  const [contextMenuTag, setContextMenuTag] = useState('');
  const [contextMenuP, setContextMenuP] = useState<IContextMenuPosition>({ left: 0, top: 0 });
  const [tagsView, setTagsView] = useState<Array<ITagView>>([]);

  const onTagClick = useCallback((path) => {
    setCurrentTag(path);
    props.history.replace(path);
  }, [props.history]);

  const onCloseClick = useCallback((e, path) => {
    e.preventDefault();
    setTagsView((pre) => pre.filter((item) => item.path !== path));
  }, []);

  const onContextMenu = useCallback((e, path) => {
    e.preventDefault();
    console.log(e);
    setContextMenuFlag(true);
    setContextMenuP({ left: e.screenX, top: 20 });
    setContextMenuTag(path);
  }, []);

  const onDocumentClick = useCallback(() => {
    setContextMenuFlag(false);
  }, []);

  const onContextMenuClick = useCallback((e) => {
    console.log(e.key);
    if (e.key === ContextMenuKeys.close) {
      setTagsView(
        (pre) => pre.filter((item) => item.path !== contextMenuTag),
      );
    }
    if (e.key === ContextMenuKeys.closeOthers) {
      setTagsView(
        (pre) => pre.filter((item) => item.path === contextMenuTag),
      );
    }
    if (e.key === ContextMenuKeys.closeAll) {
      setTagsView([]);
    }
  }, [contextMenuTag]);

  useEffect(() => {
    const path = props.location.pathname;
    setTagsView((pre) => uniqBy(
      (item) => item.path,
      [...pre, { path, title: menuTitles[path] }].filter(({ title }) => title !== undefined),
    ));
    setCurrentTag(path);
  }, [menuTitles, props.location.pathname]);

  useEffect(() => {
    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [onDocumentClick]);

  useDeepCompareEffect(() => {
    setCurrentTag((pre) => {
      const lastTag = last(tagsView);
      if (pre !== lastTag?.path) {
        return lastTag?.path || '';
      }
      return pre;
    });
  }, [tagsView]);

  return (
    <>
      {
      tagsView.length > 0 && (

      <div className={style.container}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {
          tagsView.map((item, index) => (
            <>
              <div
                className={`${style.tagC} ${item.path === currentTag ? 'tag-active' : ''}`}
                style={{
                  ...Object.assign(item.path === currentTag ? active : {}),
                }}
                onContextMenu={(e) => onContextMenu(e, item.path)}
              >
                <div className={style.tagContent}>
                  <span
                    key={item.path}
                    className={style.tag}
                    onClick={() => onTagClick(item.path)}
                  >
                    {item.title}
                  </span>
                  <CloseCircleOutlined
                    className={style.closeIcon}
                    onClick={(e) => onCloseClick(e, item.path)}
                  />
                </div>
              </div>
              {
                (index % 2 === 0) && (
                  <div className={style.divider} />
                )
              }
            </>
          ))
        }
        </div>
        <div style={{ height: '15px', background: '#ddd', width: '100%' }} />
        {
        contextMenuFlag && (
        <Menu
          className={style.contextMenu}
          style={{ top: contextMenuP.top, left: contextMenuP.left }}
          onClick={onContextMenuClick}
        >
          <Menu.Item key={ContextMenuKeys.close}>关闭当前</Menu.Item>
          <Menu.Item key={ContextMenuKeys.closeOthers}>关闭其他</Menu.Item>
          <Menu.Item key={ContextMenuKeys.closeAll}>关闭所有</Menu.Item>
        </Menu>
        )
      }
      </div>
      )
    }
    </>
  );
};

export default withRouter(MTagsView);
