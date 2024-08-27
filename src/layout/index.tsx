import AlignChat from "@/components/AlignChat"
import LoginForm from "@/components/LoginForm"
import MenuCard, { StyledButton } from "@/components/MenuCard"
import UserCard from "@/components/UserCard"
import { useEditorContext } from "@/context/editContext"
import { authAlign, loginAlign } from "@/services"
import { encrypt } from "@/util"
import {
  DoubleRightOutlined,
  OpenAIOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Box } from "@mui/system"
import { useRequest } from "ahooks"
import { Avatar, FloatButton, Layout, message, Spin, Typography } from "antd"
import { Dialog, Modal, Popup } from "antd-mobile"
import Cookies from "js-cookie"
import React, { useCallback, useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
const { Header, Footer, Sider, Content } = Layout
const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [popOpen, setPopOpen] = useState(false)
  const navigate = useNavigate()
  const [loginFormOpen, setLoginFormOpen] = useState(false)
  const [
    {
      userInfo,
      editor: { current, curMemory },
    },
    dispatch,
  ] = useEditorContext()
  const { loading } = useRequest(authAlign, {
    onSuccess(data: any, params) {
      const { data: userinfo } = data
      dispatch({ type: "initUser", payload: userinfo })
    },
    onError() {
      navigate("auth")
      Cookies.remove("align_id")
    },
  })
  const { data: userRes, runAsync: runAuth } = useRequest(loginAlign, {
    manual: true,
    onSuccess(data: any, params) {
      const { data: userinfo } = data
      dispatch({ type: "initUser", payload: userinfo })
      message.success("登录成功！")
      setLoginFormOpen(false)
    },
    onError(e, params) {
      message.error("登录失败,请检查用户信息")
    },
  })
  const onLogin = useCallback(
    (value: any) => {
      const data = new FormData()
      data.append("user", encrypt(value))
      runAuth(data)
    },
    [runAuth],
  )
  useEffect(() => {
    if (curMemory?.id) {
      setCollapsed(false)
    }
  }, [curMemory.id])
  useEffect(() => {
    if (current?.fid) {
      setCollapsed(false)
    }
  }, [current.fid])
  return (
    <Spin spinning={loading}>
      <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <Header>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              ".ant-avatar": {
                border: " 1px solid blue",
              },
            }}
          >
            <Typography.Text style={{ color: "white" }}>
              你好，
              {userInfo?.username || (
                <Typography.Link
                  onClick={() => {
                    Dialog.alert({
                      title: "提示",
                      content:
                        "您尚未登录，部分功能无法使用，如:上传图片及保存编辑数据到您的账号。",
                    })
                  }}
                >
                  {"游客"}
                </Typography.Link>
              )}
            </Typography.Text>
            <Box>
              <Avatar
                size={"large"}
                onClick={() => {
                  if (userInfo?.username) {
                    setCollapsed(true)
                  } else {
                    setLoginFormOpen(true)
                  }
                }}
                src={"/img/avatar.b9360e77.jpg"}
                //size="small"
                icon={<UserOutlined />}
              />
            </Box>
          </Box>
        </Header>
        <Content>
          <Outlet />
        </Content>
        <Footer>
          <Box
            sx={{ color: "secondary.main", textAlign: "center", fontSize: 12 }}
          >
            Align提供支持 2024-2025
          </Box>
        </Footer>
      </Layout>
      <Popup
        bodyStyle={{ background: "#303643" }}
        position="right"
        visible={collapsed}
        destroyOnClose
        closeOnMaskClick
        //showCloseButton
        onClose={() => {
          setCollapsed(false)
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            color: "#d9e0e5",
            height: "100vh",
            justifyContent: "space-between",
            //minWidth: "60vw",
          }}
        >
          <Box>
            <UserCard></UserCard>
            <MenuCard
              effectCall={() => {
                setCollapsed(false)
              }}
            ></MenuCard>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <StyledButton
              onClick={() => {
                setCollapsed(false)
              }}
              type="link"
              icon={<DoubleRightOutlined />}
            ></StyledButton>
          </Box>
        </Box>
      </Popup>
      <Modal
        title={<Box>登录</Box>}
        visible={loginFormOpen}
        closeOnMaskClick
        onClose={() => {
          setLoginFormOpen(false)
        }}
        content={<LoginForm onSubmit={onLogin}></LoginForm>}
        onAction={() => {
          setLoginFormOpen(false)
        }}
      ></Modal>
      <Popup
        visible={popOpen}
        onMaskClick={() => {
          setPopOpen(false)
        }}
        style={{ zIndex: 9999 }}
        bodyStyle={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          minHeight: "80vh",
          display: "grid",
          padding: 16,

          boxSizing: "border-box",
        }}
      >
        <AlignChat></AlignChat>
      </Popup>
      <FloatButton
        onClick={() => {
          setPopOpen(true)
        }}
        icon={<OpenAIOutlined />}
        type="primary"
        style={{ right: "10%", zIndex: 9998 }}
      />
    </Spin>
  )
}
export default AppLayout
