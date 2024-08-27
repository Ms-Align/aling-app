import { Box, SxProps } from "@mui/system"
import { useSize } from "ahooks"
import { THEME, getWeatherTheme } from "../../public/define"
import React, { useMemo, useRef } from "react"

export interface WeatherProps {
  tem?: number | string
  location?: string
  weather?: any
  date?: any
  msg?: any
  sx?: SxProps
}
export default ({
  tem = "-",
  location = "未知",
  weather = "未知",
  date = "未知时间",
  msg,
  sx = {},
}: WeatherProps) => {
  const ref = useRef(null)
  //自适应的标准是参照宽高7:2
  const size = useSize(ref)
  const rootHeight = (size?.width || 300) / 3
  const rootRadius = ((size?.width || 300) / 25).toFixed(0)
  //通过判断天气信息获取对应的主题
  const theme = useMemo<THEME>(() => {
    return getWeatherTheme(weather)
  }, [weather])
  return (
    <Box
      ref={ref}
      sx={{
        height: rootHeight,
        backgroundColor: theme.color?.light,
        borderRadius: `${rootRadius}px`,
        boxShadow:
          "0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)",
        ...sx,
      }}
    >
      <Box
        sx={{
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box>17℃</Box>
          <Box>nanjing</Box>
        </Box>
        <Box>
          <Box>@</Box>
          <Box>Align</Box>
          <Box>飞向遥远的天空</Box>
        </Box>
      </Box>
    </Box>
  )
}
