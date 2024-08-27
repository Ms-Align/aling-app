import { useEffect, useState } from "react"
import Vditor from "vditor"
import { merge } from "lodash"
import "vditor/src/assets/less/index.less"
export const Init_mobile_config = {
  toolbarConfig: {
    pin: true,
  },
  counter: {
    enable: true,
  },
  cache: {
    after: (value: any) => {},
  },
  height: window.innerHeight / 2,
  upload: {
    url: window?.alignConfig?.assetPrefix || "/api/upload/blogSource",
    fieldName: "cover",
    accept: "image/*",
    withCredentials: true,
    format(files: File[], responseText: string) {
      return JSON.stringify({
        msg: "",
        code: 0,
        data: {
          errFiles: [],
          succMap: {
            [files?.[0]?.name]:
              (window?.alignConfig?.sourceHost || "") +
              (window?.alignConfig?.assetPrefix || "") +
              "/api/static/images/" +
              responseText,
          },
        },
      })
    },
  },
  toolbar: [
    "emoji",
    "link",
    "upload",
    "edit-mode",
    "undo",
    "redo",
    {
      name: "more",
      toolbar: ["insert-after", "fullscreen", "preview", "export"],
    },
  ],
}
export const useMkdEditor = (
  root: any,
  options: Record<string, any> = Init_mobile_config,
  value = localStorage.getItem("vditorvditor"),
) => {
  const [vd, setVd] = useState<Vditor>()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!vd) {
      const vditor = new Vditor(
        root,
        merge(
          {
            after: () => {
              vditor.setValue(value || "")
              setVd(vditor)
              setLoading(false)
            },
          },
          options,
        ),
      )
    }
    //销毁编辑器时会清除本地缓存，这个特性会导致pc移动切换时缓存的内容被清空
    // Clear the effect
    // return () => {
    //   vd?.destroy()
    //   setVd(undefined)
    // }
  }, [options])
  return { vd, loading }
}
