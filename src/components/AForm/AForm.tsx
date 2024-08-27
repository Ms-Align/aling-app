import { LockOutlined, UserOutlined } from "@ant-design/icons"
import styled from "@emotion/styled"
import { Box, SxProps } from "@mui/system"
import { Form, Checkbox, Input, Button, Dialog, FormProps } from "antd-mobile"
import React, { useImperativeHandle, useRef } from "react"
const StyledForm = styled(Form)(({ theme: any }) => ({}))
import AFormItem from "./AFormItem"
export interface AFormProps extends FormProps {
  onSubmit?: (data: any) => void //内置提交按钮提交时触发
  onCancel?: (data: any) => void //内置取消按钮取消时触发
  children?: any
  footer?: any | null //默认会有footer，null则去除
}
export default React.forwardRef(
  ({ onSubmit, footer, children, onCancel, ...otr }: AFormProps, ref) => {
    const onFinish = (values: any) => {}
    const [form] = Form.useForm()
    const _onSubmit = () => {
      form.validateFields().then((res) => {
        onSubmit && onSubmit(form.getFieldsValue())
      })
    }
    const _onCancel = () => {
      form.validateFields().then((res) => {
        onCancel && onCancel(form.getFieldsValue())
      })
    }
    useImperativeHandle(
      ref,
      () => ({
        instance: form,
      }),
      [form],
    )
    return (
      <Box ref={ref}>
        <StyledForm
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          {...otr}
        >
          {children}
          {footer === null ? (
            ""
          ) : (
            <AFormItem>
              <Box
                sx={{ width: "100%", display: "flex", flexDirection: "column" }}
              >
                <Button
                  color="primary"
                  onClick={_onSubmit}
                  style={{ marginBottom: 16 }}
                >
                  确认
                </Button>
                <Button onClick={_onCancel} color="default">
                  取消
                </Button>
              </Box>
            </AFormItem>
          )}
        </StyledForm>
      </Box>
    )
  },
)
