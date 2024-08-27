import { LockOutlined, UserOutlined } from "@ant-design/icons"
import styled from "@emotion/styled"
import { Box, SxProps } from "@mui/system"
import { FormProps } from "antd"
import { Form, Checkbox, Input, Button, Dialog } from "antd-mobile"
import React from "react"
const StyledForm = styled(Form)(({ theme: any }) => ({}))
const StyledFormItem = styled(Form.Item)(({ theme: any }) => ({}))
export interface LoginFormProps {
  onSubmit?: (data: any) => void
}
export default ({ onSubmit }: LoginFormProps) => {
  const onFinish = (values: any) => {}
  const [form] = Form.useForm()
  const _onSubmit = () => {
    form.validateFields().then((res) => {
      onSubmit && onSubmit(form.getFieldsValue())
    })
  }
  return (
    <StyledForm
      form={form}
      layout="horizontal"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <StyledFormItem
        name="username"
        rules={[{ required: true, message: "请输入用户名!" }]}
      >
        <Input clearable placeholder="用户名" />
      </StyledFormItem>
      <StyledFormItem
        name="password"
        rules={[{ required: true, message: "请输入密码!" }]}
      >
        <Input clearable type="password" placeholder="密码" />
      </StyledFormItem>

      <StyledFormItem>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Button
            color="primary"
            onClick={_onSubmit}
            style={{ marginBottom: 16 }}
          >
            登录
          </Button>
          <Button
            color="default"
            onClick={() => {
              Dialog.alert({
                title: "提示",
                content: (
                  <span>
                    请前往
                    <a href="/" target="_blank">
                      Align官网
                    </a>
                    注册
                  </span>
                ),
              })
            }}
          >
            注册
          </Button>
        </Box>
      </StyledFormItem>
    </StyledForm>
  )
}
