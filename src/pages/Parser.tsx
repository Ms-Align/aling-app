import { Box } from "@mui/system"
import { Input } from "antd"
import React from "react"
import Render from "@/components/Render"
export default () => {
  const onInput = (e: any) => {
    console.log("学妍", Render(e.target?.value))
  }
  return (
    <Box>
      <Input.TextArea onChange={onInput}></Input.TextArea>
    </Box>
  )
}
