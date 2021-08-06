/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-06 22:37:02
 * @LastEditTime: 2021-08-05 10:16:07
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: d:\Data\Personal\MyPro\dashboard_template\src\view\auth\login.tsx
 */
import {
  Button, Checkbox, Form, Input, message, Modal,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { reactHooks } from '@mrrs878/js-library';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { LOGIN } from '../../api/auth';
import MVerify from '../../components/MVerify';
import { useFullScreen, useUser } from '../../store';
import style from './login.module.less';

const { useRequest } = reactHooks;

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 4 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 4 },
};

const Login = (props: RouteComponentProps) => {
  const [, fullScreen, exitFullScreen] = useFullScreen();
  const [loginFrom] = useForm();
  const [verifyModalFlag, setVerifyModalFlag] = useState(false);
  const [, loginRes, login] = useRequest(LOGIN, false);
  const [, updateUser] = useUser();

  const onSuccess = useCallback(() => {
    setVerifyModalFlag(false);
    login({ name: '', password: '' });
  }, [login]);
  const onClose = useCallback(() => {
  }, []);

  const onLoginFormFinish = useCallback(() => {
    setVerifyModalFlag(true);
  }, []);

  useEffect(() => {
    fullScreen();
    return () => {
      exitFullScreen();
    };
  }, [exitFullScreen, fullScreen]);
  useEffect(() => {
    console.log(loginRes);
    if (!loginRes) return;
    if (!loginRes.success) {
      message.error(loginRes.return_message);
      return;
    }
    exitFullScreen();
    updateUser(loginRes.data);
    localStorage.setItem('auth_token', loginRes.data.token);
    setTimeout(props.history.goBack, 500);
  }, [exitFullScreen, loginRes, props.history, updateUser]);
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

export default withRouter(Login);
