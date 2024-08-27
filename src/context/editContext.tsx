import React, { createContext, useContext, useReducer } from "react"
import { Action, AppState, EAction } from "./contextType"
import { produce } from "immer"
import { FileType } from "@/services"
import { merge } from "lodash"
const initState: AppState = {
  userInfo: {},
  editor: { current: { fileType: FileType.MARKDOWN }, curMemory: {} },
  myArticles: [],
}

const appReducer = (state: AppState, action: EAction): AppState => {
  const { type, payload } = action
  return produce(state, (draft) => {
    switch (type) {
      case "initUser":
        draft.userInfo = payload
        break
      case "updateMyArticles":
        draft.myArticles = payload
        break
      case "updateCurrent":
        draft.editor.current = merge(draft.editor.current, payload)
        break
      case "updateMemory":
        draft.editor.curMemory = merge(draft.editor.curMemory, payload)
        break
      case "updateContent":
        draft.editor.current.content = payload?.content
        break
      case "initCurrent":
        draft.editor.current = payload
        break
      case "initMemory":
        draft.editor.curMemory = payload
        break
      default:
        console.warn("unexcepted Action", action)
        break
    }
  })
}

export const useEditorContext = () => {
  return useContext(EditorProvider)
}
const EditorProvider = createContext<[AppState, React.Dispatch<EAction>]>([
  initState,
  (action: EAction) => void 0,
])

export const AppProvider = ({ children }: any) => {
  const reducer = useReducer(appReducer, initState)
  return (
    <>
      <EditorProvider.Provider value={reducer}>
        {children}
      </EditorProvider.Provider>
    </>
  )
}
