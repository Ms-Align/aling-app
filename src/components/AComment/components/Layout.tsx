import { Box } from "@mui/system"
import React from "react"
interface ApiConfig {
  host?: string | undefined
  baseUrl?: string | undefined
  path?: string | undefined
}
export interface LayoutProps {
  ApiConfig?: ApiConfig //自定义接口配置
  children?: any
}
export default ({ ApiConfig, children }: LayoutProps) => {
  return <Box>{children}</Box>
}
