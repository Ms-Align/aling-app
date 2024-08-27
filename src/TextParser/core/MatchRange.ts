import Chunk from "./Chunk"
import ChunkRange from "./ChunkRange"

export default class MatchRange extends ChunkRange {
  constructor(chunks: Chunk[]) {
    super(chunks)
    //this._startMatchs = matchs
  }
  private _startMatchs: string | undefined
  private _endMatchs: string | undefined
  set startMatchs(matchs) {
    this._startMatchs = matchs
  }
  get startMatchs() {
    return this._startMatchs
  }
  set endMatchs(matchs) {
    this._endMatchs = matchs
  }
  get endMatchs() {
    return this._endMatchs
  }
  get matchs() {
    return this.startMatchs ?? "" + this.endMatchs ?? ""
  }
  get chunks() {
    return this._chunks?.slice(1)
  }
  clearChunks() {
    this._chunks.length = 0
  }
}
