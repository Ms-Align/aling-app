import { useEditorContext } from "@/context/editContext"
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CloudSyncOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  LogoutOutlined,
  PlusOutlined,
  ProfileOutlined,
  SaveOutlined,
  SettingOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons"
import ProcessStatus from "./ProcessStatus"
import { Box, styled } from "@mui/system"
import {
  logoutAlign,
  editArticle,
  newArticle,
  checkPublicProcess,
  runPublicProcess,
  FileType,
  runGitPush,
  checkGitStatus,
  myMemorys,
  runMemoryBuild,
  deleteMemorys,
  runPublicProcessAll,
} from "@/services"
import { Button, Tag, message } from "antd"
import {
  Dialog,
  Divider,
  Popup,
  Form,
  Button as MButton,
  Ellipsis,
} from "antd-mobile"
import React, { useCallback, useEffect, useState } from "react"
import { useRequest } from "ahooks"
import FileList from "./FileList"
import Cookies from "js-cookie"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
export const StyledButton = styled(Button)(({ theme }: any) => {
  return { width: "100%", textAlign: "left", color: "#d9e0e5" }
})
export interface MenuCardProps {
  effectCall?: () => void //副作用函数
}
export default ({ effectCall }: MenuCardProps) => {
  const [
    {
      userInfo,
      editor: { current },
    },
    dispatch,
  ] = useEditorContext()
  const navigate = useNavigate()
  const [showFileList, setShowFileList] = useState(false)
  const [showSiteSettings, setShowSiteSettings] = useState(false)
  const [siteForm] = Form.useForm()
  const { runAsync: runPublic } = useRequest(runPublicProcess, {
    manual: true,
    onSuccess(data, params) {
      refreshProcessStatus()
    },
  })
  const { runAsync: runPublicAll } = useRequest(runPublicProcessAll, {
    manual: true,
    onSuccess(data, params) {
      refreshProcessStatus()
    },
  })
  const { runAsync: startBuildMemory, loading: memoryBuildLoading } =
    useRequest(runMemoryBuild, {
      manual: true,
      onSuccess(data, params) {
        message.info("开始发布")
      },
    })
  const { runAsync: runLogout } = useRequest(logoutAlign, {
    manual: true,
    onSuccess() {
      message.success("已退出登录,即将刷新页面。")
      Cookies.remove("align_id", { path: "" })
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    },
    onError() {
      message.error("退出登录失败！")
    },
  })
  const { data: processStatus, refresh: refreshProcessStatus } = useRequest(
    checkPublicProcess,
    {},
  )
  //如果在构建中，则每隔1秒获取一次状态
  useEffect(() => {
    if (
      processStatus?.data?.vercelBlog?.status?.type &&
      ![4, 5].includes(processStatus?.data?.vercelBlog?.status?.type)
    ) {
      setTimeout(() => {
        refreshProcessStatus()
      }, 1000)
    }
  }, [processStatus, refreshProcessStatus])
  const { runAsync: saveNew, loading: newLoading } = useRequest(newArticle, {
    manual: true,
    onSuccess(data, params) {
      message.info("保存成功!")
    },
    onError(e, params) {
      message.error("保存失败，请联系开发者！")
    },
  })
  const { runAsync: gitPush, loading: gitPushLoading } = useRequest(
    runGitPush,
    {
      manual: true,
      onSuccess() {
        message.success("git已同步")
        runCheckGitStatus()
      },
      onError() {},
    },
  )
  const { runAsync: saveEdit, loading: savingLoading } = useRequest(
    editArticle,
    {
      manual: true,
      onSuccess(data, params) {
        message.info("保存成功!")
      },
      onError(e, params) {
        message.error("保存失败，请联系开发者！")
      },
    },
  )
  const {
    data: coopStatus,
    loading: statusLoading,
    runAsync: runCheckGitStatus,
  } = useRequest(checkGitStatus, {
    manual: true,
  })
  console.log(coopStatus)
  const onLogout = useCallback(() => {
    Dialog.confirm({
      title: "提示",
      content: "退出登录将会重新加载页面，是否退出登录？",
      onConfirm() {
        runLogout()
      },
    })
  }, [runLogout, Dialog])
  const onSiteFormChange = useCallback((changeValues: any, values: any) => {
    console.log(changeValues, values, 2120)
  }, [])
  const onNew = useCallback(() => {
    if (current?.content && current?.content !== "\n") {
      Dialog.confirm({
        title: "提示",
        content:
          "您的编辑区存在暂存的编辑内容，新建文档将会覆盖当前的内容，是否继续？（我们后续将会支持编辑器多开。）",
        onConfirm() {
          dispatch({
            type: "initCurrent",
            payload: {
              title: "【新建文档】" + dayjs().format("YYYY-MM-DD HH:mm"),
            },
          })
          effectCall && effectCall()
        },
      })
    } else {
      dispatch({
        type: "initCurrent",
        payload: { title: "【新建文档】" + dayjs().format("YYYY-MM-DD HH:mm") },
      })
      effectCall && effectCall()
    }
  }, [dispatch, current, effectCall])
  const onPublic = useCallback(
    (fid?: string) => {
      if (fid || current?.fid) {
        Dialog.confirm({
          content: "发布会将当前编辑区文件打包构建后发布到博客，是否继续操作？",
          onConfirm() {
            runPublic({ fid: (fid || current?.fid) as string })
          },
        })
      } else {
        Dialog.confirm({
          content: "当前编辑区不存在文件，是否构建并发布所有文件？",
          onConfirm() {
            runPublicAll()
          },
        })
      }
    },
    [current, dispatch],
  )
  const onSave = useCallback(() => {
    if (!current?.title) {
      message.info("请设置文章标题！")
    } else {
      const {
        content = "",
        cover = "",
        fid = "",
        auth = [],
        tags = [],
        isPublic = false,
        fileType = FileType.MARKDOWN,
        title = "",
      } = current
      if (fid) {
        saveEdit(fid, {
          content,
          title,
          cover,
          fid,
          isPublic,
          fileType,
          tags,
          auth,
        })
      } else {
        saveNew({
          content,
          title,
          cover,
          fid,
          isPublic,
          tags,
          fileType,
        })
      }
    }
  }, [saveEdit, current])
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 3,
          px: 2,
        }}
      >
        <StyledButton
          sx={{ mb: 1 }}
          //loading={savingLoading || newLoading}
          type="primary"
          ghost
          icon={<PlusOutlined />}
          onClick={onNew}
        >
          新建文件
        </StyledButton>
        <StyledButton
          loading={savingLoading || newLoading}
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
        >
          保存文件
        </StyledButton>
        <Divider style={{ width: "100%" }}></Divider>
        <StyledButton
          type="link"
          onClick={() => {
            navigate("")
            effectCall && effectCall()
          }}
          icon={<AppstoreOutlined />}
        >
          工作台
        </StyledButton>
        <StyledButton
          type="link"
          onClick={() => {
            navigate("user")
            effectCall && effectCall()
          }}
          icon={<UserOutlined />}
        >
          个人信息
        </StyledButton>
        <StyledButton
          type="link"
          onClick={() => {
            setShowFileList(true)
          }}
          icon={<ProfileOutlined />}
        >
          我的文件
        </StyledButton>
        {userInfo.root ? (
          <StyledButton
            type="link"
            onClick={() => {
              onPublic()
            }}
            loading={
              ![4, 5].includes(processStatus?.data?.vercelBlog?.status?.type)
            }
            icon={<CloudSyncOutlined />}
          >
            更新到博客
          </StyledButton>
        ) : (
          ""
        )}
        {processStatus?.data ? (
          <ProcessStatus
            value={processStatus?.data?.vercelBlog?.status?.type}
            options={[
              {
                type: 1,
                icon: <SyncOutlined spin />,
                children: "开始发布...",
                color: "processing",
              },
              {
                type: 2,
                icon: <SyncOutlined spin />,
                children: "生成文档...",
                color: "processing",
              },
              {
                type: 3,
                icon: <SyncOutlined spin />,
                children: "正在构建...",
                color: "processing",
              },
              {
                type: 4,
                icon: <CheckCircleOutlined />,
                children: "发布成功",
                color: "success",
              },
              {
                type: 5,
                icon: <CloseCircleOutlined />,
                children: "发布失败",
                color: "error",
              },
            ]}
          ></ProcessStatus>
        ) : (
          ""
        )}
        {userInfo.root ? (
          <StyledButton
            type="link"
            loading={memoryBuildLoading}
            onClick={() => {
              Dialog.confirm({
                content: "是否发布Memory？",
                onConfirm() {
                  startBuildMemory()
                },
              })
            }}
            icon={<HeartOutlined />}
          >
            更新Memory
          </StyledButton>
        ) : (
          ""
        )}
        <StyledButton type="link" icon={<SettingOutlined />}>
          编辑偏好
        </StyledButton>
        {userInfo.root ? (
          <StyledButton
            onClick={() => {
              runCheckGitStatus()
              setShowSiteSettings(true)
            }}
            type="link"
            icon={<EnvironmentOutlined />}
          >
            站点管理
          </StyledButton>
        ) : (
          ""
        )}

        <StyledButton onClick={onLogout} type="link" icon={<LogoutOutlined />}>
          退出登录
        </StyledButton>
      </Box>
      <Popup
        destroyOnClose
        visible={showSiteSettings}
        onMaskClick={() => {
          setShowSiteSettings(false)
        }}
      >
        <Box sx={{ p: 1 }}>
          <Form form={siteForm} onValuesChange={onSiteFormChange}>
            <Box>
              <Form.Item label="git同步">
                <MButton
                  loading={gitPushLoading}
                  onClick={() => {
                    gitPush()
                  }}
                  size="small"
                  loadingText="同步中"
                  color="primary"
                >
                  开始同步
                </MButton>
                <Button
                  type="text"
                  onClick={() => {
                    Dialog.alert({
                      content: coopStatus?.data?.result + "",
                    })
                  }}
                  loading={statusLoading}
                >
                  <Box>
                    <Tag
                      style={{ display: "flex" }}
                      icon={
                        coopStatus?.data?.status == 0 ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                      color={
                        coopStatus?.data?.status == 0 ? "success" : "error"
                      }
                    >
                      <Box sx={{ color: "primary.secondary", fontSize: 12 }}>
                        {coopStatus?.data?.date
                          ? "最近同步时间: " +
                            dayjs(coopStatus?.data?.date).format(
                              "YYYY-MM-DD HH:mm:ss",
                            )
                          : "最近同步时间: ----"}
                      </Box>
                    </Tag>
                  </Box>
                </Button>
              </Form.Item>
            </Box>
          </Form>
        </Box>
      </Popup>
      <Popup
        destroyOnClose
        visible={showFileList}
        onMaskClick={() => {
          setShowFileList(false)
        }}
        bodyStyle={{ height: "50vh", overflow: "auto" }}
      >
        <FileList></FileList>
      </Popup>
    </>
  )
}
