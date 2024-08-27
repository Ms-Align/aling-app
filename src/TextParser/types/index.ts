import Meta from "../core/Meta"

export interface TextParserOptions {
  callback?: any
}
export interface Awarness {
  startLine?: number
  endLine?: number
  [key: string]: any
}
export interface MetaOptions<T> extends ChunkOptions<T> {}
export interface ChunkOptions<T> {
  callback?: any
  /**
   * 在文本中的下标
   */
  index: number
  /**
   * 文本开始下标
   */
  startIndex?: number
  /**
   * 文本结束下标
   */
  endIndex?: number
  /**
   * 前一个文本的实例
   */
  prev?: T | undefined
  /**
   * 后一个文本的实例
   */
  next?: T | undefined
  chunks?: Meta[] | T[]
  parent?: T
}
