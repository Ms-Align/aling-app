import { Box, styled } from "@mui/system"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useMkdEditor, Init_mobile_config } from "@/hooks/useMkdEditor"
import MemoryEditor from "@/components/MemoryEditor"
import {
  Card,
  Layout,
  Space,
  Avatar,
  Typography,
  message,
  Spin,
  Button,
  FloatButton,
} from "antd"
import { AppProvider, useEditorContext } from "@/context/editContext"
import { Modal, Dialog, Popup, Divider, Input, Tabs } from "antd-mobile"
import { authAlign, checkArticle, loginAlign } from "@/services"
import { useRequest, useSize } from "ahooks"
import { encrypt, decrypt } from "@/util"
import SaveStatus from "@/components/SaveStatus"
export const StyledSpace = styled(Space)(({ theme: any }) => ({}))
export default () => {
  const [loginFormOpen, setLoginFormOpen] = useState(false)
  const [
    {
      userInfo,
      editor: { current, curMemory },
    },
    dispatch,
  ] = useEditorContext()
  const size = useSize(document.body)
  const [saving, setSaving] = useState(false)
  const onSaved = (value: any) => {
    setSaving(false)
    dispatch({
      type: "updateContent",
      payload: { content: value },
    })
  }

  const onInput = useCallback(
    (value: any) => {
      !saving && setSaving(true)
    },
    [setSaving],
  )
  const editorConfig = useMemo(() => {
    return {
      cache: {
        after: onSaved,
      },
      upload: {
        url:
          (window?.alignConfig?.assetPrefix || "") + "/api/upload/blogImages",
        fieldName: "cover",
        withCredentials: true,
        format(files: File[], responseText: string) {
          return JSON.stringify({
            msg: "",
            code: 0,
            data: {
              errFiles: [],
              succMap: {
                [files?.[0]?.name]:
                  (window?.alignConfig?.sourceHost || "") +
                  //(window?.alignConfig?.assetPrefix || "") +
                  "/api/static/images/" +
                  responseText,
              },
            },
          })
        },
      },
      keydown: onInput,
    }
    // return size!.width >= 768
    //   ? {
    //       cache: {
    //         after: onSaved,
    //       },
    //       keydown: onInput,
    //     }
    //   : {
    //       ...Init_mobile_config,
    //       cache: {
    //         after: onSaved,
    //       },
    //       keydown: onInput,
    //     }
  }, [size?.width, onSaved, onInput])
  //挂载组件
  const { vd, loading: vdLoading } = useMkdEditor("vditor", editorConfig)

  const { runAsync: runCheckArticle, loading: checkDetailLoading } = useRequest(
    checkArticle,
    {
      manual: true,
      onSuccess(data, params) {
        dispatch({
          type: "initCurrent",
          payload: { ...current, ...(data?.data || {}) },
        })
        vd?.setValue(data?.data?.content)
      },
    },
  )
  // useRequest(authAlign, {
  //   onSuccess(data: any, params) {
  //     const { data: userinfo } = data
  //     dispatch({ type: "initUser", payload: userinfo })
  //     message.success("欢迎您，" + (userinfo?.username || "游客"))
  //   },
  //   onError() {
  //     Cookies.remove("align_id")
  //   },
  // })

  const localCache = localStorage.getItem("vditorvditor")
  //当当前编辑的文章id变化时，驱动接口加载文章详情
  useEffect(() => {
    current?.fid && runCheckArticle({ fid: current?.fid })
  }, [current?.fid])

  useEffect(() => {
    if (localCache !== current?.content) {
      vd?.setValue(current?.content || "")
    }
  }, [current?.content])
  return (
    <Box sx={{ height: "100%" }}>
      <Box
        sx={{
          height: "100%",
          background: "white",
          ".adm-tabs-header": {
            boxShadow: "0 5px 4px -3px rgba(0, 0, 0, 0.09)",
          },
        }}
      >
        <Tabs>
          <Tabs.Tab title="文章" key="article">
            <Spin spinning={vdLoading} tip={"正在加载编辑器..."}>
              <Box
                sx={{
                  py: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Input
                    style={{ "--font-size": "14px" }}
                    placeholder="未命名的文档"
                    clearable
                    value={current?.title}
                    onChange={(val) => {
                      dispatch({
                        type: "updateCurrent",
                        payload: { title: val },
                      })
                    }}
                  />
                </Box>
                <SaveStatus saving={saving}></SaveStatus>
              </Box>
              <Box
                id={"vditor"}
                sx={{ height: "calc(100vh - 230px)!important" }}
              ></Box>
            </Spin>
          </Tabs.Tab>
          <Tabs.Tab title="记忆" key="memory">
            <MemoryEditor></MemoryEditor>
          </Tabs.Tab>
        </Tabs>
      </Box>
    </Box>
  )
}
