import { CheckCircleOutlined, SyncOutlined } from "@ant-design/icons"
import { Box, styled } from "@mui/system"
import { Tag } from "antd"
import React from "react"
export interface SaveStatusProps {
  savingIcon?: React.ReactElement
  savedIcon?: React.ReactElement
  saving?: boolean
}
export const FlexCenterBox = styled(Box)(({ theme }: any) => {
  return { display: "flex", alignItems: "center" }
})
export default ({ savedIcon, saving, savingIcon }: SaveStatusProps) => {
  return (
    <>
      <Box>
        {saving ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            正在保存
          </Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已保存
          </Tag>
        )}
      </Box>
    </>
  )
}
