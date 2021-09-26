/*
 * @Author: your name
 * @Date: 2021-04-15 16:34:56
 * @LastEditTime: 2021-09-26 21:10:06
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\view\setting\permission.tsx
 */
import { Table } from 'antd';
import React, { useMemo } from 'react';
import useKeepScroll from 'src/hook/useKeepScroll';
import { useModel } from 'src/store';

const Permission = () => {
  useKeepScroll(window, { key: 'permissionUrls' });
  const [permissionUrls] = useModel('permissionUrls');
  const columns = useMemo(() => ([
    {
      dataIndex: 'url',
      title: '页面路径',
    },
    {
      title: '最低用户角色',
      dataIndex: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
  ]), []);

  return (
    <div className="container" id="permission">
      <Table
        rowKey={(record) => String(record.id)}
        columns={columns}
        dataSource={permissionUrls}
      />
    </div>
  );
};

export default Permission;
