import { PlusOutlined } from "@ant-design/icons"
import { Tag, Tooltip, Input, InputRef, Space } from "antd"
import React, { useEffect, useRef, useState } from "react"

export interface TagInputProps {
  value?: string[]
  initialValue?: string[]
  onChange?: (value: string[]) => void
  maxCount?: number
}
export default ({
  value,
  onChange,
  initialValue = [],
  maxCount,
}: TagInputProps) => {
  const [tags, setTags] = useState<string[]>(initialValue)
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [editInputIndex, setEditInputIndex] = useState(-1)
  const [editInputValue, setEditInputValue] = useState("")
  const inputRef = useRef<InputRef>(null)
  const editInputRef = useRef<InputRef>(null)

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus()
    }
  }, [inputVisible])

  useEffect(() => {
    editInputRef.current?.focus()
  }, [editInputValue])

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag)
    setTags(newTags)
    onChange && onChange(newTags)
  }

  const showInput = () => {
    setInputVisible(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  useEffect(() => {
    if (value instanceof Array) {
      setTags(value)
    }
  }, [value])
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue])
      onChange && onChange([...tags, inputValue])
    }
    setInputVisible(false)
    setInputValue("")
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value)
  }

  const handleEditInputConfirm = () => {
    const newTags = [...tags]
    newTags[editInputIndex] = editInputValue
    setTags(newTags)
    onChange && onChange(newTags)
    setEditInputIndex(-1)
    setEditInputValue("")
  }

  const tagInputStyle: React.CSSProperties = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: "top",
  }

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    borderStyle: "dashed",
    display:
      typeof maxCount == "number" && tags?.length >= maxCount
        ? "none"
        : undefined,
  }

  return (
    <Space size={[0, 8]} wrap>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              style={tagInputStyle}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          )
        }
        const isLongTag = tag.length > 20
        const tagElem = (
          <Tag
            key={tag}
            closable
            style={{ userSelect: "none" }}
            onClose={() => handleClose(tag)}
          >
            <span
              onClick={(e) => {
                setEditInputIndex(index)
                setEditInputValue(tag)
                e.preventDefault()
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        )
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        )
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
          新增标签
        </Tag>
      )}
    </Space>
  )
}
