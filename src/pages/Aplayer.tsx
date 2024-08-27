import { Box } from "@mui/system"
import { Button } from "antd"
import React from "react"
import { getAllMusic } from "@/services"
import { APlayer } from "aplayer-react"
import "aplayer-react/dist/index.css"
import { useRequest } from "ahooks"
const sourcePath = (window?.sourceHost || "") + "/api" + "/static"
export default () => {
  const { data: musicList } = useRequest(getAllMusic, {})
  return (
    <Box id={"align-aplayer-root"}>
      <APlayer
        audio={
          musicList?.data?.map(
            ({ url, cover, ...otr }: { url: string; cover: string }) => ({
              url: sourcePath + "/musics/" + url,
              cover: sourcePath + "/images/" + cover,
              ...otr,
            }),
          ) || [{}]
        }
        appearance="fixed"
        autoPlay
      />
    </Box>
  )
}
