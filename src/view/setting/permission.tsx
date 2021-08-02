/*
 * @Author: your name
 * @Date: 2021-04-15 16:34:56
 * @LastEditTime: 2021-08-02 20:08:17
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: d:\Data\Personal\MyPro\dashboard_template\src\view\setting\permission.tsx
 */
import { Table } from 'antd';
import React, { useMemo } from 'react';
import useKeepScroll from '../../hook/useKeepScroll';
import { useModel } from '../../store';

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
