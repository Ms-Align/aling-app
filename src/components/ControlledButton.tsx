import React, { useMemo } from "react"
import { LocationFill, RightOutline } from "antd-mobile-icons"
import { Box, styled } from "@mui/system"
import { Button as PcButton, ButtonProps, Typography } from "antd"
interface ControlledButton extends ButtonProps {
  value?: any[]
  onChange?: any
  onClick?: () => void
  placeholder?: string
  prevIcon?: React.ReactElement
  backIcon?: React.ReactElement
}
export const WxStyledButton = styled(PcButton)(({ theme }) => ({
  width: "100%",
  textAlign: "left",
  border: "none",
  boxShadow: "none",
}))
export default ({
  value,
  onChange,
  onClick,
  prevIcon,
  backIcon,
  placeholder,
  ...otr
}: ControlledButton) => {
  const active = useMemo(() => {
    return value?.length
  }, [value])
  console.log(2120, value, active)

  return (
    <>
      <WxStyledButton
        onClick={() => {
          onClick && onClick()
        }}
        type="text"
        size="large"
        icon={
          (prevIcon &&
            React.cloneElement(prevIcon, {
              color: !prevIcon.props.color
                ? active
                  ? "#52c41a"
                  : undefined
                : prevIcon.props.color,
              width: 20,
              height: 20,
            })) || (
            <LocationFill
              color={active ? "#52c41a" : undefined}
              width={20}
              height={20}
            />
          )
        }
        {...otr}
      >
        <Box
          sx={{
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: active ? "#52c41a" : undefined,
          }}
        >
          <Box>{(value?.length && value.join(" • ")) || placeholder}</Box>
          <Typography.Text style={{ paddingRight: 20 }}>
            {(backIcon &&
              React.cloneElement(backIcon, {
                color: !backIcon.props.color
                  ? active
                    ? "#52c41a"
                    : undefined
                  : backIcon.props.color,
                width: 20,
                height: 20,
              })) || <RightOutline width={20} height={20} color="#cecdcc" />}
          </Typography.Text>
        </Box>
      </WxStyledButton>
    </>
  )
}
