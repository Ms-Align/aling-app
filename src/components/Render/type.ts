export interface ComponentItem {
  _id: string
  componentName: QSType
  answer?: { result?: any; score?: any; type?: string }
  reason?: any
  source?: string
  awarness?: {
    startLine?: any
    endLine?: any
    [key: string]: any
  }
  props: {
    label: string
    name?: string
    [key: string]: any
  }
}

type QSType = "Radio" | "CheckBox" | "Input" | "Fill" | "TrF"
