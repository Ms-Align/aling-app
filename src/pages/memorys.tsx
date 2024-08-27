import { Box } from "@mui/system"
import React from "react"
import MemoryCard from "@/components/MemoryCard"
export default () => {
  return (
    <Box>
      <MemoryCard info={{ weather: "大雨" }}></MemoryCard>
    </Box>
  )
}
