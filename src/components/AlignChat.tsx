import { Popup } from "antd-mobile"
import React, { useState } from "react"

export default (props: any) => {
  return (
    <>
      <iframe
        frameBorder={"null"}
        style={{ width: "100%", height: "100%" }}
        src="https://www.ailing.site/"
        {...props}
      ></iframe>
    </>
  )
}
