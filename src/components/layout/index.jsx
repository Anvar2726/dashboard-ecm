import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  AppstoreOutlined,
  BankOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Popconfirm, theme } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
const { Header, Sider, Content } = Layout;

import { logout } from "../../redux/slice/auth";

import "./style.scss";
const LayoutPage = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [params, setParams] = useState();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setParams(pathname.split("/")[1]);
  }, [pathname]);
  const confirm = () => {
    Cookies.remove("ECommerceAdmin");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={params}
          items={[
            {
              key: "",
              icon: <BankOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: "categories",
              icon: <AppstoreOutlined />,
              label: <Link to="/categories">Categories</Link>,
            },
            {
              key: "products",
              icon: <UploadOutlined />,
              label: <Link to="/products">Products</Link>,
            },
            {
              label: (
                <Popconfirm
                  title="Logout"
                  description="Are you sure logout?"
                  onConfirm={confirm}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="primary">
                    <LoginOutlined /> Logout
                  </Button>
                </Popconfirm>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutPage;
