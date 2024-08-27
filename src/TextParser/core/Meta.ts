import { MetaOptions } from "../types"
import Chunk from "./Chunk"
/**
 * @classdesc 字符串单元
 */
export default class Meta extends Chunk {
  constructor(value: string, options: MetaOptions<Meta | Chunk>) {
    super(value, options)
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

  get endIndex() {
    return this._options.endIndex
  }
  get isLast() {
    return this._options.next === undefined
  }
  get isFirst() {
    return this._options.prev === undefined
  }
  isNumber() {
    return !Number.isNaN(this._source)
  }
  isUpperCase() {
    return /^[A-Z]*$/.test(this._source)
  }
  isLowerCase() {
    return /^[a-z]*$/.test(this._source)
  }
}
