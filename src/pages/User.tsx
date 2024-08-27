import React, { useEffect, useRef } from "react"
import { useEditorContext } from "@/context/editContext"
import { Box } from "@mui/system"
import { Form, FormInstance, message, Typography } from "antd"
import { AForm, AFormItem, WxUploader } from "aling"
import { ImageUploader, Input, Radio, TextArea, Button } from "antd-mobile"
import { useRequest } from "ahooks"
import { updateUser } from "@/services"
export default () => {
  const [{ userInfo }, dispatch] = useEditorContext()
  const form = useRef<{ instance: FormInstance }>(null)
  const { runAsync: runUpdate, loading: updataLoading } = useRequest(
    updateUser,
    {
      manual: true,
      onSuccess(data, params) {
        message.success("操作成功！")
      },
    },
  )
  useEffect(() => {
    form.current &&
      form.current.instance?.setFieldsValue({
        ...userInfo,
        avatar: userInfo.avatar?.map((item: string) => `/img/${item}`),
      })
  }, [userInfo])
  return (
    <Box sx={{ p: 2, height: "100vh", backgroundColor: "white" }}>
      <Box sx={{ mb: 1, fontWeight: 600, fontSize: 16 }}>基本信息</Box>
      <Box>
        <AForm
          ref={form}
          layout="vertical"
          initialValues={userInfo}
          onSubmit={(value) => {
            runUpdate({
              ...value,
              avatar: value.avatar?.map(
                (item: string) => item?.split("img/")?.[1],
              ),
            })
          }}
          footerOptions={{
            okButton: { loading: updataLoading, children: "更新" },
            cancelButton: {
              style: {
                display: "none",
              },
            },
          }}
        >
          <AFormItem name={"avatar"} label={"头像"}>
            <WxUploader
              sx={{
                ".adm-image-img": {
                  objectFit: "cover!important",
                },
              }}
              action={"/api/upload/image"}
              beforeUpload={(file, fileList) => {
                console.log(file, fileList)
              }}
              maxCount={1}
              accept="image/*"
            ></WxUploader>
          </AFormItem>
          <AFormItem name={"username"} label={"用户名"}>
            <Input></Input>
          </AFormItem>
          <AFormItem name={"autograph"} label={"签名"}>
            <TextArea showCount></TextArea>
          </AFormItem>
          <AFormItem name={"gender"} label={"性别"}>
            <Radio.Group>
              <Radio value={"0"}>男</Radio>
              <Radio style={{ marginLeft: 16 }} value={"1"}>
                女
              </Radio>
            </Radio.Group>
          </AFormItem>
          <AFormItem
            name={"password"}
            disabled
            //initialValue={"********"}
            label={"密码"}
          >
            <Input type="password"></Input>
          </AFormItem>
        </AForm>
      </Box>
    </Box>
  )
}
