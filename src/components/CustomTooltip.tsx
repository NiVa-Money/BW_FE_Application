import React from "react";
import { Tooltip, TooltipProps } from "@mui/material";

type CustomTooltipProps = {
  title: React.ReactNode;
  children: React.ReactElement;
  show: boolean;
} & Omit<TooltipProps, "title" | "children">;

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  title,
  children,
  show,
  ...restProps
}) => {
  if (!show) {
    return children;
  }

  return (
    <Tooltip title={title} placement="right" arrow {...restProps}>
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
