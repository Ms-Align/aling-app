import TextParser from "@/TextParser/core"
import { ComponentItem } from "./type"
import Chunk from "@/TextParser/core/Chunk"
import MatchRange from "@/TextParser/core/MatchRange"
/**
 * @description 根据起始行向下解析选项行
 */
export const parseOptions = (
  line: Chunk,
  matchRange: MatchRange,
  QS: ComponentItem,
) => {
  let cur = line.next,
    index = 0
  while (!cur?.isEmpty()) {
    //下一行是否通过(正确答案)/（正确答案）的方式指定了答案
    const curMatchRanges = cur?.getTargetChunkBy([
      ["(", ")"],
      ["（", "）"],
    ])
    if (curMatchRanges?.some((range) => range.getRangeText() === "正确答案")) {
      //如果选项通过(正确答案)的方式标注则将本题设置为正确答案,如果行以大写字母开头则将其识别为选项答案
      QS.answer!.result[0] += line.isUpperCase(0)
        ? line.chunks?.[0].value
        : String.fromCharCode(index + 65)
    }
    QS.props.options.push({
      label: cur?.value,
      value: line.isUpperCase(0)
        ? line.chunks?.[0].value
        : String.fromCharCode(index + 65),
    })
    //在后续补的处理中忽视该行
    line.awarness!.isSkip = true
    index++
    cur = cur?.next
  }
}
export default (text: string) => {
  //实例化你需要的数据结构
  const LayoutData: ComponentItem[] = []
  //实例化文本解析器
  const p = new TextParser(text)

  /**
   * 我们的ComponentItem就是我们定义的一题的数据结构，问卷星将输入的文本定义为一题并渲染的基本规则如下：
   * 1.文本以行为基本解析单位，所以我们这里以换行符为单位将文本分割
   * 2.判断是否为题干：
   *  2.1 当前行以数字开头必定会被识别成题干
   *  2.3 两行之间存在空行会被识别为题干
   * 3.识别题型
   *  3.1 选择题
   *   3.1.1 连续不存在空行的文本段，第一行会被识别成题干，后续行会被识别成选项
   */
  //将文本按指定规则分割成chunk，默认为换行
  const lines = p.getTextChunkBy()
  lines?.forEach((line, index) => {
    //判断当行是否是题干
    if (line.chunks?.[0]?.isNumber(0) && !line.awarness?.isSkip) {
      const QS: ComponentItem = {
        _id: "",
        componentName: "Input",
        awarness: {},
        answer: { score: 0, result: [] },
        props: { label: "题干" },
      }

      if (line?.next && !line.next?.isNumber(0) && !line.next?.isEmpty()) {
        //当下一行不是数字开头的行且非空时直接识别为选择题

        //匹配题干中占位符
        const matchRanges = line.getTargetChunkBy([
          ["(", ")"],
          ["（", "）"],
        ])
        console.log(1, matchRanges)
        //处理匹配结果
        matchRanges?.forEach((matchRange) => {
          //匹配的值是数字的话则设置为分数
          if (matchRange.chunks?.[0]?.isNumber()) {
            QS.answer!.score = matchRange.getRangeText()
            return
          }
          if (matchRange.chunks?.[0]?.isUpperCase()) {
            //大写字母，转化为答案
            QS.answer?.result.push(matchRange.getRangeText())
          }
          parseOptions(line, matchRange, QS)
          //答案大于一个时设置为多选题
          QS.props.options?.length > 1
            ? (QS.componentName = "CheckBox")
            : (QS.componentName = "Radio")
        })
      } else {
        //匹配题干中所有占位符
        const matchRanges = line.getTargetChunkBy([
          ["(", ")"],
          ["（", "）"],
          ["[", "]"],
          ["【", "】"],
          ["{", "}"],
        ])
        console.log(2, matchRanges)
        //处理匹配结果
        matchRanges?.forEach((matchRange) => {
          if (matchRange.matchs == "()" || matchRange.matchs == "（）") {
            //匹配的值是数字的话则设置为分数
            if (matchRange.chunks?.[0]?.isNumber()) {
              QS.answer!.score = matchRange.getRangeText()
              return
            }
            if (["对", "错"].includes(matchRange.getRangeText())) {
              //如果匹配的是对或者错则为判断题
              QS.componentName = "TrF"

              //todo 给判断题生成数据
              return
            }
          }
          if (matchRange.matchs == "{}") {
            QS.componentName = "Fill"
            QS.answer?.result.push(matchRange.getRangeText())
            //todo 生成填空题data
            return
          }
          if (matchRange.matchs == "【】" || matchRange.matchs == "[]") {
            if (
              matchRange.getRangeText() == "简答题" ||
              matchRange.getRangeText() == "简答"
            ) {
              QS.componentName = "Input"
              //todo 生成简答题数据
              return
            }
          }

          //都不满足的随意文本设置为简答题
          QS.componentName = "Input"
          return
        })
      }
    }
  })
}
