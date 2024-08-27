import { useEditorContext } from "@/context/editContext"
import { ErrorBlock } from "antd-mobile"
import React from "react"
import { useNavigate } from "react-router-dom"

const AppExceptedError = () => {
  return (
    <>
      <ErrorBlock status="default" />
    </>
  )
}

const UnAuthError = () => {
  const [{ userInfo }, dispatch] = useEditorContext()
  const navigate = useNavigate()
  if (userInfo) {
    navigate("/")
  }
  return (
    <ErrorBlock
      title={"身份认证失败"}
      description={<>请点击右上角头像登录或注册</>}
    ></ErrorBlock>
  )
}
export default UnAuthError
