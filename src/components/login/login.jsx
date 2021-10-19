import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Modal, Form, Input, Button, Checkbox} from "antd";
// eslint-disable-next-line no-unused-vars
import {
    getLoading,
    getUserInfo,
    getLoginBox,
    setLoginBox,
    login,
    loginStatus,
    setLoading,
} from "./login-slice";

export default function Login() {
    const loginBox = useSelector(getLoginBox);
    const loading = useSelector(getLoading);
    // eslint-disable-next-line no-unused-vars
    const userInfo = useSelector(getUserInfo);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loginStatus())
    }, []);
    return (
        <Modal
            title="登录"
            visible={loginBox}
            onOk={() => {
                dispatch(setLoginBox(false));
                dispatch(setLoading(false));
            }}
            confirmLoading={loading}
            footer={null}
            centered
            width={360}
            className="login-modal"
            onCancel={() => {
                dispatch(setLoginBox(false));
            }}
        >
            <Form
                name="basic"
                labelCol={{span: 0}}
                wrapperCol={{span: 24}}
                initialValues={{remember: true}}
                onFinish={() => {
                    dispatch(login());
                }}
                onFinishFailed={(errorInfo) => {
                    console.log(errorInfo);
                }}
            >
                <Form.Item name="name" rules={[{required: true, message: "请输入用户名!"}]}>
                    <Input placeholder="请输入手机号/邮箱"/>
                </Form.Item>

                <Form.Item name="password" rules={[{required: true, message: "请输入密码!"}]}>
                    <Input.Password placeholder="请输入密码"/>
                </Form.Item>
                <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>记住密码</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>登录</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
