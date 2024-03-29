/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-01 10:19:29
 * @LastEditTime: 2021-09-26 21:09:34
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\view\profile\index.tsx
 */
import { Button } from 'antd';
import { useState } from 'react';
import { MDragContainer } from 'src/components/MDragCard';
import { Comments } from './components/Comments';
import { Tasks } from './components/Tasks';
import { UserInfo } from './components/UserInfo';
import style from './index.module.less';

const ORDER_KEY = 'order';
const ORDER = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');

const Profile = () => {
  const [editable, setEditable] = useState(false);
  const [order, setOrder] = useState(ORDER);
  const [dragResult, setDragResult] = useState(ORDER);
  const onCancelClick = () => {
    setEditable(false);
    setDragResult(order);
  };
  const onEditClick = () => setEditable(true);
  const onSaveClick = () => {
    setOrder(dragResult);
    setEditable(false);
    localStorage.setItem(ORDER_KEY, JSON.stringify(dragResult));
  };

  return (
    <div className="profile container">
      <div className={style.actionsC}>
        <Button disabled={editable} type="primary" onClick={onEditClick}>编辑</Button>
        <Button disabled={!editable} onClick={onSaveClick}>保存</Button>
        <Button disabled={!editable} danger onClick={onCancelClick}>取消</Button>
      </div>
      <MDragContainer
        editable={editable}
        order={dragResult}
        onDragEnd={setDragResult}
        cards={{
          userInfo: {
            element: () => <UserInfo name="tom&jerry" />,
            size: 'small',
          },
          tasks: {
            element: Tasks,
            size: 'small',
          },
          comments: {
            element: Comments,
            size: 'large',
          },
        }}
      />
    </div>
  );
};

export default Profile;
