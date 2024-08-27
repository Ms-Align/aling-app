import React from "react"
import { Switch, SwitchProps } from "antd-mobile"
export interface CSwitchProps extends SwitchProps {
  value?: any
}
// 该组件仅仅代理了checkbox的数据指向使其能成为受控的表单组件
export default ({ value, onChange, ...other }: CSwitchProps) => {
  return (
    <>
      <Switch
        {...other}
        checked={value || false}
        onChange={(value) => {
          onChange && onChange(value || false)
        }}
      ></Switch>
    </>
  )
}
