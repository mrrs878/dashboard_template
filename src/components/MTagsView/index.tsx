/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-29 09:58:37
 * @LastEditTime: 2021-03-29 15:40:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/components/MTagsView/index.tsx
 */
// import { CloseCircleOutlined } from '@ant-design/icons';
import { CloseCircleOutlined } from '@ant-design/icons';
import {
  Divider, Dropdown, Menu, Space,
} from 'antd';
import { uniqBy } from 'ramda';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useModel } from '../../store';
import style from './index.module.less';

interface ITagView {
  path: string;
  title: string;
}

interface IMTagsViewProps extends RouteComponentProps {}

const active: React.CSSProperties = {
  borderTopLeftRadius: '15px',
  borderTopRightRadius: '15px',
  backgroundColor: '#ddd',
};

const MTagsView: React.FC<IMTagsViewProps> = (props: IMTagsViewProps) => {
  const [currentTag, setCurrentTag] = useState('');
  const [menuTitles] = useModel('menuTitles');
  const [tagsView, setTagsView] = useState<Array<ITagView>>([]);

  const onTagClick = useCallback((path) => {
    setCurrentTag(path);
    props.history.replace(path);
  }, [props.history]);

  const onCloseClick = useCallback((e, path) => {
    e.preventDefault();
    setTagsView((pre) => pre.filter((item) => item.path !== path));
  }, []);

  useEffect(() => {
    const path = props.location.pathname;
    setTagsView((pre) => uniqBy(
      (item) => item.path,
      [...pre, { path, title: menuTitles[path] }],
    ));
    setCurrentTag(path);
  }, [menuTitles, props.location.pathname]);

  return (
    <div className={style.container} onContextMenu={() => false}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {
          tagsView.map((item, index) => (
            <>
              <div
                className={`${style.tagC} ${item.path === currentTag ? 'tag-active' : ''}`}
                style={{
                  ...Object.assign(item.path === currentTag ? active : {}),
                }}
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
    </div>
  );
};

export default withRouter(MTagsView);
