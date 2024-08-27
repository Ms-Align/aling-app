import React, { useState } from "react"
import { useEditorContext } from "@/context/editContext"
import { Box } from "@mui/system"
import { Typography } from "antd"
import { Avatar, ImageViewer } from "antd-mobile"
export default () => {
  const [{ userInfo }, dispatch] = useEditorContext()
  const [avatarVisible, setAvatarVisible] = useState(false)
  return (
    <>
      <Box
        sx={{
          background: "#2a2e37",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          py: 3,
          px: 5,
        }}
      >
        <Box sx={{ display: "inline-block" }}>
          <Avatar
            onClick={() => {
              setAvatarVisible(true)
            }}
            src={`/img/${userInfo.avatar?.[0] || "avatar.b9360e77.jpg"}`}
          />
          <ImageViewer
            classNames={{
              mask: "customize-mask",
              body: "customize-body",
            }}
            getContainer={document.body}
            image={`/img/${userInfo.avatar?.[0] || "avatar.b9360e77.jpg"}`}
            visible={avatarVisible}
            onClose={() => {
              setAvatarVisible(false)
            }}
          />
        </Box>
        <Box
          sx={{
            textAlign: "center",
            pt: 1,
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {userInfo?.username || ""}
        </Box>
      </Box>
    </>
  )
}
