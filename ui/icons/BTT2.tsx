import React from "react";
import {Box, BoxProps} from "@chakra-ui/core";

interface Props extends Omit<BoxProps, "size"> {
  size?: number;
}

const ArrowLeftIcon: React.FC<Props> = ({size = 40, ...props}) => {
  return (
    <Box {...props}>
      <svg
        className="feather feather-arrow-left"
        height={size}
        stroke="currentColor"
        fill="primary"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0"
        viewBox="0 0 14 14"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 11.286 6.057 L 10.086 4.857 L 7.857 7.148 L 7.857 1 L 6.143 1 L 6.143 7.148 L 3.914 4.857 L 2.714 6.057 L 7 10.429 L 11.286 6.057 Z M 1 11.286 L 1 13 L 13 13 L 13 11.286 L 1 11.286 Z" transform="matrix(-1, 0, 0, -1, 14, 14)"/>
      </svg>
    </Box>
  );
};

export default ArrowLeftIcon;
