/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-01 10:19:29
 * @LastEditTime: 2021-08-19 13:48:28
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\view\profile\index.tsx
 */
import React, { useEffect, useState } from 'react';
import { useRequest } from '@mrrs878/hooks';
import { GET_USERS } from '../../api/user';

const Profile = () => {
  const [users, setUsers] = useState<Array<any>>([]);
  const [, getUsersRes] = useRequest(GET_USERS, true);

  useEffect(() => {
    if (!getUsersRes?.success) return;
    setUsers(getUsersRes.data);
  }, [getUsersRes]);

  return (
    <div className="container">{ users[0] && users[0].name }</div>
  );
};

export default Profile;
