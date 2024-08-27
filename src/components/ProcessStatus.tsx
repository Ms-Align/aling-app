import React, { useMemo, useState } from "react"
import { Tag, TagProps } from "antd"
import type {
  PresetStatusColorType,
  PresetColorType,
} from "antd/es/_util/colors"
export interface StatusOption {
  color: PresetColorType | PresetStatusColorType
  type: any
  children: any
  icon: React.ReactElement
}
export type StatusOptions = Array<StatusOption>
export interface ProcessStatusProps {
  options: StatusOptions
  value: any
}
export default ({ options, value }: ProcessStatusProps) => {
  const cur = useMemo(() => {
    return (
      options?.find((option) => {
        return option.type == value
      }) || options[0]
    )
  }, [options, value])
  return (
    <>
      <Tag icon={cur?.icon || ""} color={cur?.color || "default"}>
        {cur?.children || ""}
      </Tag>
    </>
  )
}
