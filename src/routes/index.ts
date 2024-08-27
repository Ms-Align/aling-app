import { type RouteObject } from "react-router-dom"
import { Component, Suspense } from "react"
import { lazy } from "react"
import Parser from "@/pages/Parser"
const User = lazy(() => import("@/pages/User"))

const Home = lazy(() => import("@/pages"))
const Memorys = lazy(() => import("@/pages/memorys"))
const Aplayer = lazy(() => import("@/pages/Aplayer"))
const ErrorBoundary = lazy(() => import("@/pages/ErrorBoundary"))
const Layout = lazy(() => import("@/layout"))

export default [
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/user",
        Component: User,
      },
      {
        path: "/auth",
        Component: ErrorBoundary,
      },
    ],
  },
  {
    path: "/memorys",
    lazy: () => import("@/pages/memorys"),
  },
  {
    path: "/parser",
    Component: Parser,
    lazy: () => import("@/pages/Parser"),
  },
  {
    path: "/aplayer",
    //Component: Aplayer,
    lazy: () => import("@/pages/Aplayer"),
  },
  {
    path: "/comment",
    //Component: Aplayer,
    lazy: () => import("@/components/AComment"),
  },
] as RouteObject[]
