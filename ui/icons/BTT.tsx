import React from "react";
import {Box, BoxProps} from "@chakra-ui/core";

interface Props extends Omit<BoxProps, "size"> {
  size?: number;
}

const ArrowLeftIcon: React.FC<Props> = ({size = 70, ...props}) => {
  return (
    <Box {...props}>
      <svg fill="#2a69ac" stroke="white" strokeWidth="30" height={size} viewBox="40 40 700 700" xmlns="http://www.w3.org/2000/svg"><title>ionicons-v5-b</title><path d="M256,48C141.13,48,48,141.13,48,256s93.13,208,208,208,208-93.13,208-208S370.87,48,256,48Zm96,270.63-96-96-96,96L137.37,296,256,177.37,374.63,296Z"/></svg>
    </Box>
  );
};

export default ArrowLeftIcon;
