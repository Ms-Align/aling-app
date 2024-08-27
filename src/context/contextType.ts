import { ArticleObject } from "@/services"

export interface UserInfo {
  [key: string]: any
}
export interface EditorContext {
  current: Record<string, any> & ArticleObject //当前正在编辑的文章
  curMemory: Record<string, any> & { id?: string } //当前正在更新的Memory
}
export interface AppState {
  userInfo: UserInfo
  editor: EditorContext
  myArticles: any[]
}
export type Action =
  | "initUser" //初始化用户信息
  | "updateMyArticles" //更新文章列表
  | "updateCurrent" //更新当前编辑的文章信息
  | "updateContent" //更新文章内容
  | "updateMemory" //更新Memory内容
  | "initCurrent" //重置当前编辑的文章信息
  | "initMemory" //重置当前编辑的Memory信息

export interface EAction {
  type: Action
  payload: any
}
