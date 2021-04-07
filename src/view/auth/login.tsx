/*
 * @Author: your name
 * @Date: 2021-04-06 22:37:02
 * @LastEditTime: 2021-04-07 19:18:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\view\auth\login.tsx
 */
import {
  Button, Checkbox, Form, Input, message, Modal,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import MVerify from '../../components/MVerify';
import { useFullScreen } from '../../store';
import style from './login.module.less';

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 4 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const Login = () => {
  const [, fullScreen] = useFullScreen();
  const [loginFrom] = useForm();
  const [verifyModalFlag, setVerifyModalFlag] = useState(false);

  const onSuccess = useCallback(() => {
    message.success('登录成功');
  }, []);
  const onClose = useCallback(() => {
  }, []);

  const onLoginFormFinish = useCallback(() => {
    setVerifyModalFlag(true);
  }, []);

  useEffect(() => {
    fullScreen();
  }, [fullScreen]);
  return (
    <div className={style.container}>
      <Form
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        form={loginFrom}
        initialValues={{ remember: true }}
        onFinish={onLoginFormFinish}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={tailLayout.wrapperCol} name="remember" valuePropName="checked">
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={tailLayout.wrapperCol}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
      <Modal visible={verifyModalFlag} footer={false} onCancel={() => setVerifyModalFlag(false)}>
        <MVerify onSuccess={onSuccess} onClose={onClose} />
      </Modal>
    </div>
  );
};

export default Login;
