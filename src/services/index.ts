import { Toast } from "antd-mobile"
import axios from "axios"

const request = axios.create({
  baseURL: (window?.alignConfig?.apiPrefix || "") + "/api",
})
request.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    Toast.show({
      content: error?.response?.data || "请求错误",
    })
    return Promise.reject(error)
  },
)
export interface MyArticleParams {
  num?: number
  offset?: number
  sort?: "-time" | "time"
}
export enum FileType {
  MARKDOWN = ".md",
  HTML = "html",
  TXT = ".txt",
}
export interface ArticleObject {
  abstract?: string
  content?: string
  cover?: string
  fid?: ""
  auth?: any[]
  tags?: any[]
  isPublic?: boolean
  title?: string
  fileType?: FileType
}
const urls = {
  login: "/login",
  regist: "/regist",
  auth: "/auth",
  updateUser: "/update/user",
  logout: "/logout",
  myArticle: "/article/list",
  newArticle: "/article/new",
  editArticle: "/article/edit",
  deleteArticle: "/article",
  checkArticle: "article/detail",
  runPublicProcess: "/vercelBlog/runPublic",
  runPublicProcessAll: "/vercelBlog/runPublicAll",
  runMemoryBuild: "/memory/build",
  runGitPush: "/vercelBlog/runGitPush",
  checkGitStatus: "/vercelBlog/checkGitCoopStatus",
  checkPublicProcess: "/vercelBlog/publicStatus",
  uploadImage: "/upload/blogImages/",
  uploadMusic: "/upload/blogMusics/",
  myMemorys: "/memory/list",
  allMusic: "/music/list",
  deleteMemory: "/memory/delete",
  handleMemory: "/memory/handle",
}

export const loginAlign = (data: any) => {
  return request({
    url: urls.login,
    method: "POST",
    data,
  })
}
export const updateUser = (data?: any) => {
  return request({ url: urls.updateUser, method: "POST", data })
}
export const myMemorys = (params: any) => {
  return request({
    url: urls.myMemorys,
    params,
  })
}
export function deleteMemorys(id: string = "") {
  return request({
    url: urls.deleteMemory + "?id=" + id,
  })
}
export function runMemoryBuild() {
  return request({
    url: urls.runMemoryBuild,
  })
}
export function getAllMusic() {
  return request({
    url: urls.allMusic,
  })
}
/**
 *
 * @param data data的类型是formdata是接口早期设定成这样的，这里为了方便复用了以前的上传接口
 * @returns
 */
export function uploadImage(data: FormData) {
  return request({
    method: "POST",
    url: urls.uploadImage,
    data,
  })
}
export function uploadMusic(data: FormData) {
  return request({
    method: "POST",
    url: urls.uploadMusic,
    data,
  })
}
/**
 *
 * @param data
 * @param id 当传递了id时，将会执行修改的操作
 * @returns
 */
export const handleMemory = (data: any, id?: string) => {
  return request({
    url: urls.handleMemory,
    method: "POST",
    data,
  })
}
export const checkGitStatus = () => {
  return request({
    url: urls.checkGitStatus,
    method: "get",
  })
}
export const registAlign = (data: any) => {
  return request({
    url: urls.regist,
    method: "POST",
    data,
  })
}
export const runGitPush = () => {
  return request({
    url: urls.runGitPush,
    method: "get",
  })
}
export const editArticle = (id: string, data: ArticleObject) => {
  return request({
    url: urls.editArticle + "?fid=" + id,
    method: "POST",
    data,
  })
}
export const newArticle = (data: ArticleObject) => {
  return request({
    url: urls.newArticle,
    method: "POST",
    data,
  })
}
export const checkPublicProcess = () => {
  return request({
    url: urls.checkPublicProcess,
  })
}
export const myArticle = (
  params: MyArticleParams = { sort: "-time", num: 999 },
) => {
  return request({
    url: urls.myArticle,
    params,
  })
}
export const deleteArticle = (params: { fid: string }) => {
  return request({
    url: urls.deleteArticle,
    method: "DELETE",
    params,
  })
}
export const checkArticle = (params: { fid: string }) => {
  return request({
    url: urls.checkArticle,
    params,
  })
}
export const authAlign = () => {
  return request({
    url: urls.auth,
  })
}
/**
 * @description 发布该文章
 * @param params 要发布的文件id
 * @returns Promise
 */
export const runPublicProcess = (params?: { fid: string }) => {
  return request({
    url: urls.runPublicProcess,
    params,
  })
}
/**
 * @description 发布所有文章
 * @param params 要发布的文件id
 * @returns Promise
 */
export const runPublicProcessAll = () => {
  return request({
    url: urls.runPublicProcessAll,
  })
}
export const logoutAlign = () => {
  return request({
    url: urls.logout,
  })
}
