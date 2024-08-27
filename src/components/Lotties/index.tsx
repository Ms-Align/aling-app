import React from "react"
import Lottie from "lottie-react"
import cat from "./assets/loadingcat.json"
const Loading = () => {
  return <Lottie animationData={cat}></Lottie>
}

export { Loading }
