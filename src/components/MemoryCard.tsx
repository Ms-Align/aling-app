import { Box } from "@mui/system"
import React, { useMemo, useRef } from "react"
import { useSize } from "ahooks"
import { THEME, getWeatherTheme } from "../../public/define"
import WeatherCard from "./WeatherCard"
import { Typography } from "antd"
export interface INFO {
  weather?: string //天气信息
  content?: any
  publisher?: any
}
export interface MemoryCardProps {
  info: INFO
}

const { Paragraph } = Typography

export default ({ info: { weather = "未知" } }: MemoryCardProps) => {
  const ref = useRef(null)
  //自适应的标准是参照宽高2:1
  const size = useSize(ref)
  const rootHeight = ((size?.width || 340) / 2.5).toFixed(2)
  const rootPx = ((size?.width || 340) / 10).toFixed(0)
  const rootPt = ((size?.width || 340) / 20).toFixed(0)
  const rootPb = ((size?.width || 340) / 40).toFixed(0)
  const rootFontSize = ((size?.width || 340) / 25).toFixed(0)
  const rootRadius = ((size?.width || 340) / 30).toFixed(0)

  //通过判断天气信息获取对应的主题
  const theme = useMemo<THEME>(() => {
    return getWeatherTheme(weather)
  }, [weather])
  return (
    <Box
      ref={ref}
      sx={{
        width: 600,
        minHeight: rootHeight,
        backgroundColor: theme.color?.light,
        borderRadius: `${rootRadius}px`,
        paddingLeft: rootPx + "px",
        paddingRight: rootPx + "px",
        paddingBottom: rootPb + "px",
        paddingTop: rootPt + "px",
      }}
    >
      <WeatherCard></WeatherCard>
      <Typography.Title></Typography.Title>
      <Box>
        <Paragraph
          ellipsis={{
            rows: 1,
            expandable: true,
            symbol: "详情",
            // suffix: "--William Shakespeare",
            // onEllipsis: (ellipsis) => {
            //   console.log("Ellipsis changed:", ellipsis)
            // },
          }}
          style={{
            fontWeight: "bold",
            color: theme.color?.main,
            fontSize: rootFontSize + "px",
          }}
        >
          但盼风雨来，能留你在此但盼风雨来，能留你在此但盼风雨来，能留你在此但盼风雨来，能留你在此但盼风雨来，能留你在此但盼风雨来，能留你在此但盼风雨来，能留你在此但盼风雨来，能留你在此但盼风雨来，能留你在此但盼风雨来，能留你在此
        </Paragraph>
        <Typography.Paragraph
          style={{
            textAlign: "right",
            color: theme.color?.main,
            fontSize: rootFontSize + "px",
          }}
        >
          ----梦亦同趋
        </Typography.Paragraph>
      </Box>
    </Box>
  )
}
