import React from "react";
import {Box, Text, Flex, Stack, FlexProps} from "@chakra-ui/core";

import Image from "~/ui/feedback/Image";
import {Product} from "~/product/types";
import {usePrice} from "~/i18n/hooks";
import {getVariantsPriceRange} from "~/product/selectors";


interface Props extends Omit<FlexProps, "onClick"> {
  product: Product;
  onClick?: (product: Product) => void;
  isRaised?: boolean;
}

const PortraitProductCard: React.FC<Props> = ({isRaised = false, product, onClick, ...props}) => {
  const p = usePrice();
  const {image, title, price, originalPrice, type} = product;
  const [min, max] = getVariantsPriceRange(product.options);

  function formattedImg(image) {
    const position = image.indexOf('/upload/') + 8;
    const format = "w_480,f_auto,q_auto/";
    return [image.slice(0,position),format,image.slice(position)].join('');
  }
  
  function handleClick() {
    onClick && onClick(product);
  }

  // If we get here by any point, return null
  if (type === "hidden") return null;

  return (
    <Flex
      alignItems="flex-end"
      boxShadow={isRaised ? "lg" : "none"}
      cursor={onClick ? "pointer" : "inherit"}
      data-test-id="product"
      direction="column"
      justifyContent="space-between"
      position="relative"
      rounded="md"
      transition="transform 0.2s"
      onClick={handleClick}
      marginBottom={2}
      {...props}
    >
      <Image
        fadeIn
        height={{base: 48, sm: 48}}
        rounded="md"
        //src={image || "/assets/fallback.jpg"}
        src={image ? formattedImg(image) : "/assets/fallback.jpg"}
        width="100%"
      />
      <Flex
        visibility={type === "unavailable" ? "visible" : "hidden"}
        backgroundColor= "white"
        opacity={type === "unavailable" ? 0.5 : 0}
        position="absolute"
        width="100%"
        height="100%"
        paddingTop={20}
        justifyContent='space-evenly'
        flexWrap='wrap'
      >
      </Flex>
      <Flex
        visibility={type === "unavailable" ? "visible" : "hidden"}
        position="absolute"
        width="100%"
        paddingTop={20}
        justifyContent='space-evenly'
        flexWrap='wrap'
      >
        <Box
        backgroundColor= "black"
        color= "white"
        display= "Flex"
        alignItems= 'center'
        justifyContent= 'center'
        textAlign= 'center'
        paddingX={2}
        fontSize="sm"
        fontWeight= "900"
        >
          AGOTADO
        </Box>
        <Box
        backgroundColor= "white"
        color= "black"
        width= "100%"
        display= "Flex"
        alignItems= 'center'
        justifyContent= 'center'
        textAlign= 'center'
        marginX="10%"
        fontSize="xs"
        fontWeight= "900"
        >
          STOCK PRONTO
        </Box>
      </Flex>
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        height="100%"
        justifyContent="space-between"
        padding={isRaised ? {base: 2, sm: 4} : 0}
        paddingTop={2}
        width="100%"
      >
        <Text
          display="block"
          fontSize={{base: "sm", sm: "sm"}}
          textTransform="uppercase"
          fontWeight={500}
          lineHeight="normal"
          marginBottom={2}
          overflowWrap="break-word"
        >
          {title}
        </Text>
        {/*type === "available" &&(
          <Stack isInline alignItems="center">
            <Text color="green.500" fontSize="lg" fontWeight={600} lineHeight={1}>
              {p(price)}
            </Text>
          </Stack>
        )*/}
        {/*type === "promotional" && */(
          <Stack isInline alignItems="center">
            <Text color="green.500" fontSize="lg" fontWeight={600} lineHeight={1}>
              {p(price)}
            </Text>
            {originalPrice && (
              <Text color="gray.500" fontSize="md" lineHeight={1} textDecoration="line-through">
                {p(originalPrice)}
              </Text>
            )}
          </Stack>
        )}
        {/*type === "unavailable" && (
          <Text color="yellow.500" fontSize="md" fontWeight={900} lineHeight={1}>
            Consultar Stock
          </Text>
        )*/}
        {type === "variant" && (
          <Text color="green.500" fontSize="sm" fontWeight={500} lineHeight={1}>
            {min === max ? p(min) : p(min)} ~ {p(max)}
          </Text>
        )}
        {/*type === "ask" && (
          <Text color="green.500" fontSize="sm" fontWeight={500} lineHeight={1}>
            A consultar
          </Text>
        )*/}
      </Box>
    </Flex>
  );
};

export default PortraitProductCard;
