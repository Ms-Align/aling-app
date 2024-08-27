import { SxConfig, SxProps, display, styled } from "@mui/system"
import { Form, FormItemProps } from "antd-mobile"
import React from "react"
import { Property } from "csstype"
const StyledFormItem = styled<React.FC<FormItemProps>>(Form.Item)(
  ({ theme: any }) => ({}),
)
export interface AFormItemProps extends FormItemProps {
  sx?: SxProps
  flex?:
    | [Property.JustifyContent, Property.AlignContent, Property.FlexDirection]
    | [Property.JustifyContent, Property.AlignContent] //快捷设置flex布局，优先级低于sx
}
const AFormItem = ({ sx, flex, children, ...otr }: AFormItemProps) => {
  return (
    <>
      <StyledFormItem
        {...otr}
        sx={
          flex?.length
            ? {
                ".adm-form-item-child-inner": {
                  display: "flex",
                  flexDirection: flex[2] || "row",
                  justifyContent: flex[0],
                  alignItems: flex[1],
                },
                ...sx,
              }
            : sx
        }
      >
        {children}
      </StyledFormItem>
    </>
  )
}
export default AFormItem
