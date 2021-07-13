import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { getLoading, getUserInfo, getloginBox, setLoginBox, login, setLoading } from './login-slice';

export default function Login() {

  const loginBox = useSelector(getloginBox);
  const loading = useSelector(getLoading);
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);


  console.log(userInfo)


  return (
    <Modal
      title="登录"
      visible={loginBox}
      onOk={() => { dispatch(setLoginBox(false)); dispatch(setLoading(false)) }}
      confirmLoading={loading}
      onCancel={() => { dispatch(setLoginBox(false)) }}
    >

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={() => { dispatch(login()) }}
        onFinishFailed={(errorInfo) => { console.log(errorInfo) }}
      >
        <Form.Item
          label="用户名"
          name="name"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
