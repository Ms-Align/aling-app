import Chunk from "./Chunk"

export default class ChunkRange {
  constructor(chunks: Chunk[]) {
    this._chunks = chunks
  }
  _chunks: Chunk[]

  get chunks() {
    return this._chunks
  }

  pushChunk(chunks: Chunk[]) {
    this._chunks.push(...chunks)
  }
  //获取chunkrange文本
  getRangeText() {
    return this.chunks
      .map((chunk) => {
        return chunk.value
      })
      ?.join("")
  }
  getChunkByIndex(index: number) {
    if (index > -1) {
      return this.chunks[index]
    } else {
      return this._chunks?.slice(index)?.[0]
    }
  }
}
