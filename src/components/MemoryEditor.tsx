import { Box, styled } from "@mui/system"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { location } from "../../public/define"
import {
  Form,
  TextArea,
  Button,
  Space,
  ImageUploader,
  Input,
  Cascader,
  Toast,
  ImageUploadItem,
  Popup,
  Card,
  Dialog,
  Result,
  ResultProps,
  Modal,
} from "antd-mobile"
//import ControlledButton from "./ControlledButton"
import { WxButton as ControlledButton, WxUploader } from "aling"

import {
  EyeFill,
  SmileFill,
  UndoOutline,
  DeleteOutline,
  AudioFill,
} from "antd-mobile-icons"
import { useRequest } from "ahooks"
import { useEditorContext } from "@/context/editContext"
import { handleMemory, uploadImage, uploadMusic } from "@/services/index"
import { message, Button as PcButton, Typography, Upload } from "antd"
import {
  PlusSquareOutlined,
  QuestionCircleOutlined,
  SoundFilled,
} from "@ant-design/icons"
import TagInput from "./TagInput"
import { round } from "lodash"
const { Dragger } = Upload
import { getLocation, getCityInfo, getWeather } from "@/services/thired"
import AForm, { AFormItem } from "@/components/AForm"
import { StyledButton } from "./MenuCard"
const maxCount = 20
export default () => {
  const [form] = Form.useForm()
  const musicFormRef = useRef()
  const uploadRoot = useRef()
  const [locationVisible, setLocationVisible] = useState(false)
  const [psdVisible, setPsdVisible] = useState(false)
  const [sourceFormOpen, setSourceFormOpen] = useState(false)
  const formLocation = Form.useWatch("location", form)
  const [resultConfig, setResultConfig] = useState<ResultProps | null>()
  const [
    {
      userInfo,
      editor: { curMemory },
    },
    dispatch,
  ] = useEditorContext()
  const [fileList, setFileList] = useState<ImageUploadItem[]>([
    {
      url: "",
    },
  ])
  const { runAsync: handlePublish, loading: publishLoading } = useRequest(
    handleMemory,
    {
      manual: true,
      onSuccess(data, params) {
        message.success("发表成功")
        setResultConfig({
          status: "success",
          title: "发布成功",
          description: (
            <Box>
              您可构建发布该Memory或
              <PcButton
                type="link"
                onClick={() => {
                  setResultConfig(null)
                  form.resetFields()
                  dispatch({ type: "initMemory", payload: {} })
                  setTimeout(() => {
                    runLocation()
                  }, 0)
                }}
              >
                返回
              </PcButton>
            </Box>
          ),
        })
      },
    },
  )
  const { runAsync: runUpload, loading: uploadLoading } = useRequest(
    uploadImage,
    {
      manual: true,
    },
  )
  const { runAsync: runUploadMusic, loading: uploadMusicLoading } = useRequest(
    uploadMusic,
    {
      manual: true,
    },
  )
  const {
    loading: locationLoading,
    data: locationInfo,
    runAsync: runLocation,
  } = useRequest(getLocation, {
    onSuccess: (res) => {
      form.setFieldValue("location", [
        res?.content?.address_detail?.province,
        res?.content?.address_detail?.city,
      ])
    },
  })
  const { data: cityInfo, runAsync: getCity } = useRequest(
    (params) => getCityInfo(params),
    {
      manual: true,
    },
  )
  //每次地址变化时查找对应地区的id
  useEffect(() => {
    const param = formLocation?.slice(-1)?.[0],
      adm =
        formLocation?.length > 1
          ? formLocation?.length > 2
            ? formLocation?.[1]
            : formLocation?.[0]
          : ""
    getCity({ location: param, adm })
  }, [formLocation])
  const { loading: weatherLoading, runAsync: runWeather } = useRequest(
    getWeather,
    {
      manual: true,
      onSuccess: (res) => {
        form.setFieldValue("weather", [
          res?.data?.now?.text,
          (res?.data?.now?.temp || "-") + "℃",
        ])
      },
    },
  )
  const onLocationClick = useCallback(() => {
    setLocationVisible(true)
  }, [setLocationVisible])
  const onPsdClick = useCallback(() => {
    setPsdVisible(true)
  }, [setPsdVisible])
  //当编辑器中的文章id变化时，更新编辑列表
  useEffect(() => {
    if (curMemory?.id) {
      const data = {
        ...curMemory,
        img:
          curMemory?.img?.map(
            (item: string) =>
              //url: "https://1.94.60.205/api/static/images/" + item,
              "https://www.zhongfw.online/img/memorys/" + item,
          ) || [],
      }
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
  }, [curMemory.id, form])
  const onNewMemory = useCallback(() => {
    dispatch({ type: "initMemory", payload: {} })
    form.resetFields()
    setTimeout(() => {
      runLocation()
    }, 0)
  }, [dispatch, form])
  useEffect(() => {
    form?.setFieldValue("nickname", userInfo.username)
  }, [userInfo])
  return (
    <>
      <Box
        sx={{
          ".adm-list-body": {
            border: "none",
          },
          ".ant-upload-btn": {
            padding: "0px!important",
          },
          ".ant-upload-drag": {
            background: "white!important",
            border: "none",
          },
        }}
      >
        {resultConfig ? (
          <Result
            status={resultConfig?.status}
            title={resultConfig?.title}
            description={resultConfig?.description}
          />
        ) : (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <PcButton
                icon={<PlusSquareOutlined />}
                onClick={() => {
                  onNewMemory()
                }}
                type="link"
              >
                新建
              </PcButton>
              <Button
                loading={publishLoading}
                onClick={() => {
                  if (userInfo?.username) {
                    form.validateFields().then((res) => {
                      console.log(res)
                      handlePublish({
                        avatar: "/img/avatar.jpg",
                        ...form.getFieldsValue(),
                        id: curMemory?.id,
                        img: form.getFieldValue("img")?.map((file: any) => {
                          if (file instanceof Object) {
                            return file.response || ""
                          }
                          return file.split("/")?.slice(-1)?.[0] || ""
                        }),
                      })
                    })
                  } else {
                    message.warning("请先登录")
                  }
                }}
                color="success"
              >
                发表
              </Button>
            </Space>
            <Form
              form={form}
              initialValues={{
                nickname: userInfo.username,
                location: [],
              }}
            >
              <Form.Item
                name={"content"}
                required
                rules={[{ required: true, message: "内容不能为空哦" }]}
              >
                <TextArea
                  autoSize={{ minRows: 5, maxRows: 10 }}
                  placeholder="这一刻的想法..."
                ></TextArea>
              </Form.Item>
              <Form.Item name={"img"}>
                {/* <ImageUploader
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
                  maxCount={maxCount}
                  preview={false}
                  accept="*"
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
                ></ImageUploader> */}
                <WxUploader
                  action={"/api/upload/blogImages/"}
                  beforeUpload={(file: any, fileList: any) => {
                    console.log(file, fileList)
                  }}
                  multiple
                  accept="image/*"
                ></WxUploader>
              </Form.Item>
              <Form.Item
                name={"location"}
                required
                rules={[
                  {
                    required: true,
                    message: "请选择您的地址",
                  },
                ]}
              >
                <ControlledButton
                  loading={locationLoading}
                  onClick={onLocationClick}
                  placeholder="所在位置"
                ></ControlledButton>
              </Form.Item>
              <Form.Item
                name={"nickname"}
                required
                style={{ display: "none" }}
                rules={[{ required: true, message: "请设置您的名称" }]}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item name={"weather"}>
                <ControlledButton
                  prevIcon={<SmileFill />}
                  loading={weatherLoading}
                  placeholder="天气"
                  onClick={() => {
                    runWeather(cityInfo?.data?.location?.[0]?.id)
                    const location = form.getFieldValue("location")
                    Toast.show({
                      content: (
                        <Box>当前城市为：{location?.join("") || "未知"}</Box>
                      ),
                    })
                  }}
                ></ControlledButton>
              </Form.Item>
              <Dragger
                maxCount={0}
                showUploadList={false}
                accept="audio/*"
                style={{}}
                beforeUpload={async (file) => {
                  //劫持文件上传
                  const formData = new FormData()
                  formData.append(file.name, file)
                  //异步上传
                  try {
                    const result = await runUploadMusic(formData)
                    setTimeout(() => {
                      form.setFieldValue("music", [result?.data, result?.data])
                      setSourceFormOpen(false)
                    }, 100)
                    return false
                  } catch (e: any) {
                    return false
                  }
                }}
              >
                <Box
                  ref={uploadRoot}
                  onClick={(e) => {
                    //存在值时弹窗
                    if (
                      form.getFieldValue("music")?.length &&
                      !sourceFormOpen
                    ) {
                      e.stopPropagation()
                      setSourceFormOpen(true)
                    } else {
                      return void 0
                    }
                  }}
                >
                  <Form.Item name={"music"}>
                    <ControlledButton
                      prevIcon={<AudioFill />}
                      loading={uploadMusicLoading}
                      backIcon={<Box></Box>}
                      placeholder="音频"
                    ></ControlledButton>
                  </Form.Item>
                </Box>
              </Dragger>

              <Form.Item>
                <ControlledButton
                  value={form.getFieldValue("psd")}
                  onClick={onPsdClick}
                  prevIcon={<EyeFill />}
                  placeholder={"权限"}
                ></ControlledButton>
                <Popup
                  visible={psdVisible}
                  onMaskClick={() => {
                    setPsdVisible(false)
                  }}
                  onClose={() => {
                    setPsdVisible(false)
                  }}
                  bodyStyle={{ height: "20vh" }}
                >
                  <Form.Item
                    rules={[
                      {
                        validator: (_: any, value: any) => {
                          if (value?.length == 1) {
                            return Promise.reject(new Error("请输入鉴权密码！"))
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box>权限认证</Box>
                        <Box>
                          <PcButton
                            onClick={() => {
                              Dialog.alert({
                                title: "关于权限认证",
                                content: (
                                  <Space direction="vertical">
                                    <Typography.Paragraph>
                                      与文章的权限验证类似，您输入的第一个tag将会作为认证的问题，第二个tag将会作为认证的密码，通过验证的用户才能查看到您的发布内容。
                                    </Typography.Paragraph>
                                  </Space>
                                ),
                              })
                            }}
                            size="small"
                            icon={<QuestionCircleOutlined />}
                            type="link"
                          ></PcButton>
                        </Box>
                      </Box>
                    }
                    name={"psd"}
                  >
                    <TagInput maxCount={2}></TagInput>
                  </Form.Item>
                </Popup>
              </Form.Item>
            </Form>
          </Space>
        )}
        <Modal
          title={<Box>文件信息</Box>}
          visible={sourceFormOpen}
          destroyOnClose
          closeOnMaskClick
          onClose={() => {
            setSourceFormOpen(false)
          }}
          content={
            <AForm
              ref={musicFormRef}
              initialValues={{
                fileName: form.getFieldValue("music")?.[0],
                source:
                  form.getFieldValue("music")?.[1] ||
                  form.getFieldValue("music")?.[0],
              }}
              layout="vertical"
              onSubmit={(formData) => {
                form.setFieldValue("music", [
                  formData?.fileName,
                  formData.source,
                ])
                setSourceFormOpen(false)
              }}
              onCancel={() => {
                setSourceFormOpen(false)
              }}
            >
              <AFormItem name={"fileName"} label={"文件名称"}>
                <Input clearable></Input>
              </AFormItem>
              <AFormItem
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ pr: 1 }}>源</Box>
                    <Box>
                      <PcButton
                        onClick={() => {
                          Dialog.alert({
                            title: "关于源的设置",
                            content: (
                              <Space direction="vertical">
                                <Typography.Paragraph>
                                  1.源决定了播放资源的路径，当您上传资源会自动生成一个文件源（文件播放地址），请勿修改否则会导致资源无法播放。
                                </Typography.Paragraph>
                                <Typography.Paragraph>
                                  2.您也可以将源修改为有效的第三方资源地址
                                </Typography.Paragraph>
                              </Space>
                            ),
                          })
                        }}
                        size="small"
                        icon={<QuestionCircleOutlined />}
                        type="link"
                      ></PcButton>
                    </Box>
                  </Box>
                }
                flex={["start", "center"]}
              >
                <AFormItem sx={{ p: 0 }} name={"source"}>
                  <Input clearable></Input>
                </AFormItem>
                <Button
                  size="small"
                  style={{ fontSize: 12, width: 105 }}
                  onClick={() => {
                    ;(uploadRoot.current as any)?.click()
                  }}
                  color="primary"
                >
                  重新上传
                </Button>
              </AFormItem>
            </AForm>
          }
          onAction={() => {
            setSourceFormOpen(false)
          }}
        ></Modal>
        <Cascader
          options={location}
          title={
            <PcButton
              type="text"
              onClick={() => {
                runLocation()
              }}
              icon={<UndoOutline />}
            >
              重新定位
            </PcButton>
          }
          visible={locationVisible}
          value={form.getFieldValue("location")}
          onSelect={(value, extend) => {
            form.setFieldValue("location", value)
          }}
          onClose={() => {
            setLocationVisible(false)
          }}
        />
      </Box>
    </>
  )
}
