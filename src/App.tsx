import React, { Suspense } from "react"
import routes from "./routes"
import { ThemeProvider } from "@mui/system"
import AppLayout from "@/layout"
import { ConfigProvider } from "antd"
import "../public/CONFIG.js"
import zhCN from "antd/locale/zh_CN"
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom"
import theme from "./theme"
import { AppProvider } from "./context/editContext"
import { Loading } from "./components/Lotties"
const router = createBrowserRouter(
  routes,
  process.env.NODE_ENV == "production"
    ? { basename: "/blog/markdown-editor/" }
    : undefined,
)
//const router = createBrowserRouter(routes, { basename: "/blog/example/" })

export default () => (
  <ConfigProvider locale={zhCN}>
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Suspense fallback={<Loading></Loading>}>
          <RouterProvider router={router}></RouterProvider>
        </Suspense>
      </AppProvider>
    </ThemeProvider>
  </ConfigProvider>
)
