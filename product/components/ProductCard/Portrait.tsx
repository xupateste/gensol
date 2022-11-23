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
  const {image, title, price, originalPrice, type, isnew, priceOff, lastStock, isPreOrder, numPiezas} = product;
  const [min, max] = getVariantsPriceRange(product.options);

  function formattedImg(image) {
    const position = image.indexOf('/upload/') + 8;
    const format = "w_200,f_auto,q_auto/";
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
        //height={{base: 48, sm: 48}}
        paddingBottom="100%"
        height="0"
        rounded="md"
        //src={image || "/assets/fallback.jpg"}
        src={image ? formattedImg(image) : "/assets/fallback.jpg"}
        width="100%"
      />
      <Box
        position="absolute"
        width="100%"
        paddingBottom="100%"
        height="0"
      >
        {(type === "unavailable") && (
                <Flex height="200px" w="100%" borderColor="gray.400">
                  <Flex h="100%" w="100%" position="absolute">
                  </Flex>
                  <Text m="auto" fontSize="12px" fontWeight="bold" px={2} bg="black" color="white" position="relative">PRODUCTO SIN STOCK</Text>
                </Flex>)
          ||  lastStock && (
                <Flex paddingBottom="100%" height="0" w="100%" borderColor="#00aaf3">
                  <Box fontWeight="bold" fontSize="11px" bg="#00aaf3" position="absolute" top={0} right={0} display="inline-flex" justifyContent="center">
                    <Text fontStyle="italic" px={2} color="white">¡ÚLTIMO STOCK!</Text>
                  </Box>
                  <Box fontWeight="bold" fontSize="10px" bg="#00aaf3" position="absolute" bottom="0" right={0} w="100%" py={1} display="inline-flex" justifyContent="center">
                    <Text color="white">SOLO QUEDAN</Text>
                    <Text as="span" bg="#0073bf" px={1} ml={1} fontStyle="italic" color="white">{lastStock} PIEZAS</Text>
                  </Box>
                </Flex>)
          ||  priceOff && (
                <Flex paddingBottom="100%" height="0" w="100%" borderColor="#d90000" justifyContent="flex-end">
                  <Box fontWeight="bold" float="right">
                    <Text fontStyle="italic" textAlign="right" fontSize="13px" bg="#d90000" px={1} mt={0} color="#fff200">–{(100*(priceOff-price)/priceOff) | 0 }% Dcto</Text>
                    <Text fontStyle="italic" textAlign="right" fontSize="9px" bg="#d90000" px={1} mt="-3px" float="right" color="#fff">Antes {p(priceOff)}</Text>
                  </Box>
                </Flex>)
          ||  isnew && (
                <Flex paddingBottom="100%" height="0" w="100%" borderColor="#d90000">
                  <Box fontWeight="bold" fontSize="12px" bg="#d90000" position="absolute" top={0} right={0} display="inline-flex" justifyContent="center">
                    <Text fontStyle="italic" px={2} color="white">¡NUEVO!</Text>
                  </Box>
                </Flex>)
          ||  isPreOrder && (
              <Flex paddingBottom="100%" height="0" w="100%" borderColor="#ffe600">
                <Box fontWeight="bold" fontSize="12px" bg="#ffe600" position="absolute" top={0} right={0} display="inline-flex" justifyContent="center">
                  <Text fontStyle="italic" px={2} color="#013d81">PRE-VENTA</Text>
                </Box>
              </Flex>)
        }
      </Box>
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        height="100%"
        justifyContent="space-between"
        padding={isRaised ? {base: 2, sm: 4} : 0}
        paddingTop={1}
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
            {numPiezas > 1 && (
              <Box display="inline-block" verticalAlign="sub" ml={1}>
                <Text display="block" color="gray.500" fontSize={10} lineHeight={1} mt="-8px">
                  {"CADA PIEZA"}
                </Text>
                <Text color="gray.500" fontSize="md" lineHeight={1} textDecoration="line-through">
                  {p(originalPrice)}
                </Text>
              </Box>)
            ||
              <Text color="gray.500" fontSize="md" lineHeight={1} textDecoration="line-through">
                {p(originalPrice)}
              </Text>
            }
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
