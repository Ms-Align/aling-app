import {
  CommentOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  FileMarkdownOutlined,
  FileTextOutlined,
  HeartFilled,
  LeftOutlined,
  LikeOutlined,
  QuestionCircleOutlined,
  QuestionOutlined,
  SwapLeftOutlined,
  UserOutlined,
} from "@ant-design/icons"
import TagInput from "./TagInput"
import {
  Button,
  DatePicker,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from "antd"
import {
  Dialog,
  Form,
  Toast,
  Image,
  ImageUploader,
  Input,
  Tabs,
  List,
  Popup,
  SwipeAction,
  Button as MButton,
  TextArea,
  Switch,
} from "antd-mobile"
import { Action } from "antd-mobile/es/components/swipe-action"
import React, { useCallback, useState } from "react"
import {
  myArticle,
  deleteArticle,
  FileType,
  editArticle,
  uploadImage,
  handleMemory,
} from "@/services"
import { useRequest } from "ahooks"
import dayjs from "dayjs"
import { myMemorys, deleteMemorys } from "@/services"
import { useEditorContext } from "@/context/editContext"
import { Box, styled } from "@mui/system"
import CSwitch from "./CSwitch"
const StyledSwipeAction = styled(SwipeAction)(({ theme }: any) => ({}))
const maxCount = 1
export default () => {
  const [
    {
      myArticles,
      editor: { current, curMemory },
    },
    dispatch,
  ] = useEditorContext()
  const { runAsync: getMyArticle, loading } = useRequest(myArticle, {
    onSuccess(data, params) {
      dispatch({ type: "updateMyArticles", payload: data?.data || [] })
    },
  })
  const [editForm] = Form.useForm()
  const [targetInfo, setTargetInfo] = useState<any>(null)
  const [editPup, setEditPup] = useState(false)
  const { runAsync: runDeleteArticle, loading: deleteLoading } = useRequest(
    deleteArticle,
    {
      manual: true,
      onSuccess(data, params) {
        getMyArticle()
      },
    },
  )
  const {
    runAsync: getMyMemorys,
    data: allMyMemorys,
    refresh: refreshMyMemorys,
    loading: memoryLoading,
  } = useRequest(() => myMemorys({ heart: "desc" }), {
    //manual: true,
    onSuccess(data, params) {},
  })
  const { runAsync: deleteMyMemorys, loading: memoDeleteLoading } = useRequest(
    deleteMemorys,
    {
      //manual: true,
      onSuccess(data, params) {
        refreshMyMemorys()
      },
    },
  )
  const { runAsync: saveEdit, loading: savingLoading } = useRequest(
    editArticle,
    {
      manual: true,
      onSuccess(data, params) {
        message.info("更新成功!")
      },
      onError(e, params) {
        message.error("更新失败，请联系开发者！")
      },
    },
  )
  const { runAsync: editMemory, loading: editMemoryLoading } = useRequest(
    handleMemory,
    {
      manual: true,
      onSuccess(data, params) {
        refreshMyMemorys()
      },
    },
  )
  const leftActions: Action[] = [
    // {
    //   key: "pin",
    //   text: "置顶",
    //   color: "primary",
    // },
  ]
  const onEdit = useCallback(
    (info: any) => {
      dispatch({ type: "initCurrent", payload: info })
    },
    [dispatch],
  )
  const onEditMemory = useCallback(
    (info: any) => {
      dispatch({ type: "initMemory", payload: info })
    },
    [dispatch],
  )
  const onDelete = useCallback(
    (info: any) => {
      runDeleteArticle({ fid: info?.fid })
    },
    [dispatch, runDeleteArticle],
  )
  const onCheckDetail = useCallback(
    (info: any) => {
      setEditPup(true)
      setTargetInfo(info)
      editForm.setFieldsValue({
        ...info,
        create_time: dayjs(info?.create_time),
        cover: (info?.cover?.length &&
          info?.cover?.map((item: string) => ({
            url: "https://www.zhongfw.online/img/memorys/" + item,
            //url: "https://1.94.60.205/api/static/images/" + item,
          }))) || [
          {
            url: "https://www.zhongfw.online/img/in-post/2021-12-24/header.jpg",
          },
        ],
      })
    },
    [Dialog, setEditPup, editForm, setTargetInfo],
  )
  const { runAsync: runUpload, loading: uploadLoading } = useRequest(
    uploadImage,
    {
      manual: true,
    },
  )
  const onUpdate = useCallback(
    (info: any) => {
      if (targetInfo) {
        saveEdit(targetInfo.fid, {
          ...info,
          cover: editForm
            .getFieldValue("cover")
            ?.map((item: { url: any }, index: number) => {
              return item.url?.split("/")?.slice(-1)?.[0] || ""
            }),
        })
      }
      //如果被更新的文章是当前编辑中的文章则还要同时跟新编辑器中的文章信息
      if (current.fid == info.fid) {
        dispatch({ type: "updateCurrent", payload: { title: info.title } })
      }
    },
    [targetInfo],
  )
  return (
    <>
      <Tabs>
        <Tabs.Tab title="文件" key="documents">
          <Spin spinning={loading}>
            <List header={"我的文件列表"}>
              {myArticles?.map((article, key) => (
                <StyledSwipeAction
                  key={key}
                  sx={{
                    ".adm-plain-anchor":
                      current?.fid == article.fid
                        ? {
                            pl: 0,
                            borderLeft: "12px solid #1677ff",
                            backgroundColor: "#ebebeb",
                          }
                        : {},
                  }}
                  leftActions={leftActions}
                  rightActions={[
                    // {
                    //   key: "unsubscribe",
                    //   text: "取消关注",
                    //   color: "light",
                    // },
                    {
                      key: "edit",
                      text: "编辑",
                      color: "primary",
                      onClick(e) {
                        onEdit(article)
                      },
                    },
                    {
                      key: "delete",
                      text: "删除",
                      color: "danger",
                      onClick(e) {
                        Dialog.confirm({
                          title: "提示",
                          content: "是否删除该文件?",
                          onConfirm() {
                            onDelete(article)
                          },
                        })
                      },
                    },
                  ]}
                >
                  <List.Item
                    prefix={
                      article?.fileType == FileType.MARKDOWN ? (
                        <FileMarkdownOutlined />
                      ) : (
                        <FileTextOutlined />
                      )
                    }
                    description={
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            //flexDirection: "column",
                            fontSize: 14,
                            alignItems: "center",
                            color: "secondary.main",
                            //pl: 2,
                          }}
                        >
                          <Box>{`${dayjs(article.create_time || "").format(
                            "YYYY-MM-DD HH:mm",
                          )}`}</Box>
                          <Box
                            sx={{
                              display: "flex",
                              pl: 1,
                              ".ant-btn": {
                                px: 1,
                                py: 0.5,
                              },
                            }}
                          >
                            <Button
                              disabled
                              style={{ paddingLeft: 0 }}
                              type="text"
                              icon={<EyeOutlined />}
                            >
                              {article?.access_count || 0}
                            </Button>
                            <Button
                              disabled
                              type="text"
                              icon={<LikeOutlined />}
                            >
                              {article?.thumbUp || 0}
                            </Button>
                            <Button
                              disabled
                              type="text"
                              icon={<CommentOutlined />}
                            >
                              {article?.remarks_count || 0}
                            </Button>
                          </Box>
                        </Box>
                      </>
                    }
                    arrow={false}
                    extra={
                      <Button
                        type="text"
                        icon={<SwapLeftOutlined />}
                        // onClick={() => {
                        //   onEdit(article)
                        // }}
                      >
                        滑动
                      </Button>
                    }
                    onClick={() => {
                      onCheckDetail(article)
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <Typography.Text ellipsis>
                        {article?.title || "未命名文档"}
                      </Typography.Text>
                    </Box>
                  </List.Item>
                </StyledSwipeAction>
              ))}
              <Popup
                visible={editPup}
                onMaskClick={() => {
                  setEditPup(false)
                }}
              >
                <Form form={editForm}>
                  <Form.Item
                    label={"标题"}
                    required
                    name={"title"}
                    rules={[{ required: true, message: "请设置文章标题" }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item label="封面" name={"cover"}>
                    <ImageUploader
                      beforeUpload={(file: File) => {
                        if (file.size > 10 * 1024 * 1024) {
                          Toast.show("请选择小于 10M 的图片")
                          return null
                        }
                        return file
                      }}
                      onCountExceed={(exceed) => {
                        Toast.show(
                          `最多选择 ${maxCount} 张图片，你多选了 ${exceed} 张`,
                        )
                      }}
                      onDelete={() => {
                        Toast.show(
                          `如未设置封面，将仍会使用默认图片作为博客封面`,
                        )
                      }}
                      maxCount={maxCount}
                      preview={false}
                      upload={async (file: File) => {
                        //用户选择图片时即上传
                        const formData = new FormData()
                        formData.append(file.name, file)
                        //异步上传
                        try {
                          const result = await runUpload(formData)
                          return {
                            url: result?.data,
                            thumbnailUrl: URL.createObjectURL(file),
                          }
                        } catch (e: any) {
                          return { url: "" }
                        }
                      }}
                    ></ImageUploader>
                  </Form.Item>
                  <Form.Item label={"创建时间"} name={"create_time"}>
                    <DatePicker />
                  </Form.Item>
                  <Form.Item label={"简介"} name={"abstract"}>
                    <TextArea placeholder="如果不设置将会自动截取文章开头部分作为简介"></TextArea>
                  </Form.Item>
                  <Form.Item label={"标签"} name={"tags"}>
                    <TagInput></TagInput>
                  </Form.Item>
                  <Form.Item label={"文件类型"} name={"fileType"}>
                    <Select
                      style={{ width: "100%" }}
                      options={[
                        { label: "markdown", value: ".md" },
                        { label: "txt", value: ".txt" },
                        { label: "html", value: ".html" },
                      ]}
                    ></Select>
                  </Form.Item>
                  <Form.Item name={"hidden"} label={"在博客中隐藏"}>
                    <CSwitch />
                  </Form.Item>
                  <Form.Item
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box>权限认证</Box>
                        <Box>
                          <Button
                            onClick={() => {
                              Dialog.alert({
                                title: "关于权限认证",
                                content: (
                                  <Space direction="vertical">
                                    <Typography.Paragraph>
                                      1：您输入的第一个tag将会作为认证的问题，第二个tag将会作为认证的密码。
                                    </Typography.Paragraph>
                                    <Typography.Paragraph>
                                      2：您可输入第三个tag作为您的联系方式，当他人想查看您的文章时可以据此联系您获得密码。
                                    </Typography.Paragraph>
                                    <Typography.Paragraph>
                                      3：联系方式可以参考如下模板
                                    </Typography.Paragraph>
                                    <Typography.Text copyable>
                                      【emall：xxxxxxxx@qq.com】
                                    </Typography.Text>
                                  </Space>
                                ),
                              })
                            }}
                            size="small"
                            icon={<QuestionCircleOutlined />}
                            type="link"
                          ></Button>
                        </Box>
                      </Box>
                    }
                    name={"auth"}
                  >
                    <TagInput></TagInput>
                  </Form.Item>
                  <Form.Item>
                    <MButton
                      loading={savingLoading}
                      onClick={() => {
                        editForm.validateFields().then(() => {
                          onUpdate(editForm.getFieldsValue())
                        })
                      }}
                      style={{ width: "100%" }}
                      color="primary"
                    >
                      更新
                    </MButton>
                  </Form.Item>
                </Form>
              </Popup>
            </List>
          </Spin>
        </Tabs.Tab>
        <Tabs.Tab title="记忆" key="memorys">
          <Spin
            spinning={memoryLoading || editMemoryLoading || memoDeleteLoading}
          >
            <List header={"我的记忆"}>
              {(allMyMemorys?.data as any[])?.map((memory, key) => (
                <StyledSwipeAction
                  key={key}
                  sx={{
                    ".adm-plain-anchor":
                      curMemory?.id == memory.id
                        ? {
                            pl: 0,
                            borderLeft: "12px solid #1677ff",
                            backgroundColor: "#ebebeb",
                          }
                        : {},
                  }}
                  leftActions={leftActions}
                  rightActions={[
                    // {
                    //   key: "unsubscribe",
                    //   text: "取消关注",
                    //   color: "light",
                    // },
                    {
                      key: "edit",
                      text: "编辑",
                      color: "primary",
                      onClick(e) {
                        onEditMemory(memory)
                      },
                    },
                    {
                      key: "delete",
                      text: "删除",
                      color: "danger",
                      onClick(e) {
                        Dialog.confirm({
                          title: "提示",
                          content: "是否删除这条记忆?",
                          onConfirm() {
                            deleteMyMemorys(memory?.id)
                          },
                        })
                      },
                    },
                  ]}
                >
                  <List.Item
                    prefix={<FieldTimeOutlined />}
                    description={
                      <>
                        <Box
                          sx={{
                            display: "grid",
                            //flexDirection: "column",
                            fontSize: 14,
                            color: "secondary.secondary",
                            //pl: 2,
                          }}
                        >
                          <Typography.Text ellipsis={true}>
                            {memory?.content || "-"}
                          </Typography.Text>
                          <Box
                            sx={{
                              display: "flex",
                              pl: 1,
                              ".ant-btn": {
                                px: 1,
                                py: 0.5,
                              },
                            }}
                          >
                            {/* <Button
                              disabled
                              style={{ paddingLeft: 0 }}
                              type="text"
                              icon={<UserOutlined />}
                            >
                              {memory?.owner || "未知"}
                            </Button> */}
                            {/* <Button
                              disabled
                              type="text"
                              icon={<EnvironmentOutlined />}
                            >
                              {memory?.location?.join(" • ") || "未知"}
                            </Button> */}
                            {/* <Button
                              disabled
                              type="text"
                              icon={<CommentOutlined />}
                            >
                              {memory?.commits?.length || 0}
                            </Button> */}
                          </Box>
                        </Box>
                      </>
                    }
                    arrow={false}
                    extra={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          ".ant-btn-icon": {
                            pr: 0.5,
                          },
                        }}
                      >
                        <Button
                          size="large"
                          type="text"
                          style={{
                            color: memory.heart > 0 ? "red" : undefined,
                          }}
                          icon={<HeartFilled />}
                          onClick={() => {
                            editMemory({
                              heart: (memory.heart || 0) + 1,
                              id: memory.id,
                            })
                          }}
                        >
                          {memory?.heart || " "}
                        </Button>
                        <Button
                          style={{ padding: 0 }}
                          onClick={() => {
                            Dialog.alert({
                              title: "提示",
                              content: "左滑菜单可编辑当前项",
                            })
                          }}
                          type="text"
                          icon={<SwapLeftOutlined />}
                          // onClick={() => {
                          //   onEdit(article)
                          // }}
                        >
                          滑动
                        </Button>
                      </Box>
                    }
                  >
                    <Box sx={{ display: "flex", width: "100%" }}>
                      <Box sx={{ fontWeight: "bold" }}>{`${dayjs(
                        parseInt(memory?.time) || "",
                      ).format("YYYY-MM-DD HH:mm")}`}</Box>
                    </Box>
                  </List.Item>
                </StyledSwipeAction>
              ))}
            </List>
          </Spin>
        </Tabs.Tab>
      </Tabs>
    </>
  )
}
