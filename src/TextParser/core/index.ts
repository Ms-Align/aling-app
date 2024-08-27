import { TextParserOptions } from "../types"
import Chunk from "./Chunk"
import Meta from "./Meta"
/**
 * @classdesc 解析器实例
 */
export default class TextParser {
  constructor(source: string, options?: TextParserOptions) {
    this._source = source
    this._options = options
    this.init(source, options)
  }

  //保留实例化初始值
  private readonly _source: string
  private readonly _options: TextParserOptions | undefined
  readonly Metas: Meta[] = []

  get source() {
    return this._source
  }
  private init(source: string, options?: TextParserOptions) {
    let prev: undefined | Meta
    source.split("")?.forEach((le, index) => {
      const meta = new Meta(le, {
        index,
        startIndex: index,
        endIndex: ++index,
        prev,
      })
      if (prev) {
        prev.next = meta
      }
      prev = meta
      this.Metas.push(meta)
    })
  }

  //公共方法

  /**
   * @description 将文本按照指定字符分段
   */
  getTextChunkBy(values = ["\n"]) {
    let metas: Array<Meta | any> = []
    const chunks: Chunk[] = []
    let prev: undefined | Chunk
    this.Metas.forEach((meta) => {
      if (values?.includes(meta.value)) {
        const chunkStr = metas?.map((meta) => meta.value)?.join("")
        const chunkIns = new Chunk(chunkStr, {
          index: chunkStr.length - 1,
          chunks: metas,
          prev,
        })
        chunkIns.chunks?.forEach((item: any, index: number) => {
          item.parent = chunkIns
        })
        chunks.push(chunkIns)
        if (prev) {
          prev.next = chunkIns
        }
        metas = []
        prev = chunkIns
      } else {
        metas.push(meta)
        if (meta.isLast) {
          const chunkStr = metas?.map((meta) => meta.value)?.join("")
          const chunkIns = new Chunk(chunkStr, {
            index: chunkStr.length - 1,
            chunks: metas,
            prev,
          })
          chunkIns.chunks?.forEach((item: any, index: number) => {
            item.parent = chunkIns
          })
          chunks.push(chunkIns)
          if (prev) {
            prev.next = chunkIns
          }
          metas = []
          prev = chunkIns
        }
      }
    })
    //实例化chunk对象
    //const chunk = chunkStr.map((str,index)=>new Chunk(str,{index,startIndex:}))
    return chunks
  }
}
