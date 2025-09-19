import React from "react";
import Cookies from "js-cookie";
import { Button, Flex, Form, Input, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/auth";
import { useNavigate } from "react-router";
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const { data } = await axios.post("https://dummyjson.com/auth/login", values);
      Cookies.set("ECommerceAdmin", data.accessToken);
      dispatch(login());
      navigate("/");
    } catch (error) {
      message.error(error.response.data.message);
      message.info("username: emilys, pass: emilyspass");
    }
  };
  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please fill username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please fill password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
