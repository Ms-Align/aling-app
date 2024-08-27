import { Awarness, ChunkOptions, MetaOptions } from "../types"
import ChunkRange from "./ChunkRange"
import MatchRange from "./MatchRange"
import Meta from "./Meta"
/**
 * @classdesc 通用的chunk类
 */
export default class Chunk {
  constructor(value: string, options: ChunkOptions<Chunk | Meta>) {
    this._source = value
    this._options = options
    this.chunks = options?.chunks
  }
  protected _source: string
  protected readonly _options: ChunkOptions<Chunk | Meta>
  //当前chunk所属的父级
  protected _parent: any
  protected _chunks: Meta[] | Chunk[] | undefined

  protected _awarness?: Awarness
  get awarness() {
    return this._awarness
  }
  set awarness(value) {
    this._awarness = { ...this?._awarness, ...value }
  }
  get value() {
    return this._source
  }
  get index() {
    return this._options.index
  }
  get startIndex() {
    return this._options.startIndex
  }
  get prev() {
    return this._options.prev
  }
  set prev(value: Chunk | undefined) {
    this._options.prev = value
  }
  get next() {
    return this._options.next
  }
  set next(value: Chunk | undefined) {
    this._options.next = value
  }
  get endIndex() {
    return this._options.endIndex
  }
  get isLast() {
    return this._options.next === undefined
  }
  get isFirst() {
    return this._options.prev === undefined
  }
  get parent() {
    return this._parent
  }
  set parent(value) {
    this._parent = value
  }
  get chunks() {
    return this._chunks
  }
  set chunks(value) {
    this._chunks = value
  }
  isEmpty() {
    return Boolean(this._chunks?.length)
  }
  isNumber(index?: number) {
    return index
      ? !Number.isNaN(this._source?.[index])
      : !Number.isNaN(this._source)
  }
  isUpperCase(index?: number) {
    return index !== undefined
      ? /^[A-Z]+$/.test(this._source?.[index])
      : /^[A-Z]+$/.test(this._source)
  }
  isLowerCase(index: number) {
    return index !== undefined
      ? /^[a-z]+$/.test(this._source?.[index])
      : /^[a-z]+$/.test(this._source)
  }
  /**
   * @description chunk迭代器
   * @param handler (chunk)=> void
   */
  chunkIterator(handler: (chunk: Chunk) => void) {
    this._chunks?.forEach((item) => {
      handler(item)
    })
  }
  /**
   * @description 根据起始chunk和指定步数获取chunk
   */
  protected getChunkByStep(start: Chunk, step: number, offset = 0): ChunkRange {
    const range = new ChunkRange([])
    let index = 0
    while (index < step) {
      range.pushChunk([eval(`start${"?.next".repeat(index++)}`)])
    }
    return range
  }
  /**
   * @description 根据起始chunk和指定步数获取chunk
   */
  protected getChunkByEnder(
    start: Chunk,
    ender: string,
    offset = 0,
  ): MatchRange {
    const range = new MatchRange([start])
    while (range.getChunkByIndex(-1).next) {
      const cur = range.getChunkByIndex(-1)?.next
      if (cur) {
        if (cur?.value == ender?.[0]) {
          const stepRange = this.getChunkByStep(cur, ender.length)
          if (ender === stepRange?.getRangeText()) {
            range.endMatchs = ender
            return range
          }
        }
        range.pushChunk([cur])
      }
    }
    range.clearChunks()
    return range
  }
  /**
   * @description 通过指定条件获取文本
   * @param rules 匹配规则(元素为长度为2的数组，表示匹配的开始和结束)
   */
  getTargetChunkBy(rules: string[][] | string[]): MatchRange[] | undefined {
    const result: MatchRange[] = []
    const startWith: string[] = rules?.map((rule) => rule?.[0])
    const endWith = rules?.map((rule) => rule?.[1])
    this.chunkIterator((chunkItem: Chunk) => {
      //判断开始标志长度
      startWith?.forEach((start: string, index) => {
        if (start[0] === chunkItem.value) {
          const stepRange = this.getChunkByStep(chunkItem, start.length)
          if (start === stepRange?.getRangeText()) {
            const enderRange = this.getChunkByEnder(
              stepRange?.getChunkByIndex(-1),
              endWith[index],
            )
            enderRange.startMatchs = start
            result.push(enderRange)
          }
        }
      })
    })
    return result
  }
}
