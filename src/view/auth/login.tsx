/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-06 22:37:02
 * @LastEditTime: 2021-08-27 19:27:58
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\view\auth\login.tsx
 */
import {
  Button, Checkbox, Form, Input, message, Modal,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { useRequest } from '@mrrs878/hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { MVerify } from '@mrrs878/sliding-puzzle';
import { CHECK_PUZZLE, GET_PUZZLE_IMG, LOGIN } from '../../api/auth';
import { useFullScreen, useUser } from '../../store';
import style from './login.module.less';
import '@mrrs878/sliding-puzzle/dist/index.css';

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
  const [, puzzleImgRes, getPuzzleImg, reGetPuzzleImg] = useRequest(GET_PUZZLE_IMG, false);
  const [,, checkPuzzle] = useRequest(CHECK_PUZZLE, false);
  const [, updateUser] = useUser();

  const onLoginFormFinish = useCallback(() => {
    setVerifyModalFlag(true);
    getPuzzleImg();
    console.log(2);
  }, [getPuzzleImg]);

  const onPuzzleRelease = useCallback(async (left) => {
    const session = puzzleImgRes?.data.session || '';
    const res = await checkPuzzle({ session, left });
    if (res.return_code === 0) {
      setVerifyModalFlag(false);
      login({ name: '', password: '' });
    }
    return Promise.resolve(res.return_code === 0);
  }, [checkPuzzle, login, puzzleImgRes?.data.session]);

  useEffect(() => {
    fullScreen();
    return () => {
      exitFullScreen();
    };
  }, [exitFullScreen, fullScreen]);
  useEffect(() => {
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
        <MVerify
          background={puzzleImgRes?.data.background || ''}
          block={puzzleImgRes?.data.block || ''}
          onRelease={onPuzzleRelease}
          onRefresh={() => {
            reGetPuzzleImg();
            return Promise.resolve(true);
          }}
        />
      </Modal>
    </div>
  );
};

export default withRouter(Login);
