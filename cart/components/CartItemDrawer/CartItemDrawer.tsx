import React from "react";
import {IDrawer, Text, Stack, Flex, Box, SimpleGrid, Grid} from "@chakra-ui/core";

import SummaryButton from "../SummaryButton";

import Drawer, {DrawerBody, DrawerFooter} from "~/ui/controls/Drawer";
import {Product, Variant} from "~/product/types";
import ProductVariantForm from "~/product/forms/ProductVariantForm";
import ArrowLeftIcon from "~/ui/icons/ArrowLeft";
import Stepper from "~/ui/inputs/Stepper";
import FormLabel from "~/ui/form/FormLabel";
//import TruncatedText from "~/ui/feedback/ToggleableText";
import ToggleableImage from "~/ui/feedback/ToggleableImage";
import {useTranslation} from "~/i18n/hooks";
import {useToast} from "~/hooks/toast";
import ShareIcon from "~/ui/icons/Share";
import {useAnalytics} from "~/analytics/hooks";
import Textarea from "~/ui/inputs/Textarea";
import FormControl from "~/ui/form/FormControl";
import {useTenant} from "~/tenant/hooks";
import Link from "~/ui/controls/Link";
import Button from "~/ui/controls/Button";
import {usePrice} from "~/i18n/hooks";


interface Props extends Omit<IDrawer, "children"> {
  onSubmit: (product: Product, options: Variant[], count: number, note: string) => void;
  product: Product;
}

const CartItemDrawer: React.FC<Props> = ({onClose, product, onSubmit, ...props}) => {
  const [count, setCount] = React.useState(1);
  const [note, setNote] = React.useState("");
  const p = usePrice();
  const t = useTranslation();
  const log = useAnalytics();
  const toast = useToast();
  const {flags} = useTenant();
  const canShare = {
    prompt: Boolean(navigator?.share),
    clipboard: Boolean(navigator?.clipboard),
  };
  
  function formattedImg(image) {
    const position = image.indexOf('/upload/') + 8;
    const format = "w_360,f_auto,q_auto/";
    return [image.slice(0,position),format,image.slice(position)].join('');
  }

  function handleSubmit(options: Variant[]) {
    onSubmit(product, options, count, note);
  }

  function handleShare() {
    if (canShare.prompt) {
      navigator
        .share({
          title: product.title,
          text: "",//product.description,
          url: window.location.href,
        })
        .then(() => {
          toast({
            status: t("cartItemDrawer.share.prompt.status"),
            title: t("cartItemDrawer.share.prompt.title"),
            description: t("cartItemDrawer.share.prompt.description"),
          });

          log.share(product, "mobile");
        })
        .catch(() => {
          console.info("El dialogo de share fue cerrado");
        });
    } else if (canShare.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast({
            status: t("cartItemDrawer.share.clipboard.status"),
            title: t("cartItemDrawer.share.clipboard.title"),
            description: t("cartItemDrawer.share.clipboard.description"),
          });

          log.share(product, "desktop");
        })
        .catch(() => {
          toast({
            status: t("cartItemDrawer.share.clipboard.error.status"),
            title: t("cartItemDrawer.share.clipboard.error.title"),
            description: t("cartItemDrawer.share.clipboard.error.description"),
          });
        });
    }
  }

  function handleNoteChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNote(event.target.value);
  }

  React.useLayoutEffect(() => {
    if (product) {
      log.viewProduct(product);
    }
  }, [product, log]);

  // If we get here by any point, return null
  if (product.type === "hidden") return null;

  return (
    <Drawer id="cart-item" placement="right" size="md" onClose={onClose} {...props}>
      <ProductVariantForm
        defaultValues={product.options}
        type={product.type}
        onSubmit={handleSubmit}
      >
        {({form, submit, isLoading, watch}) => {
          const variants = Object.values(watch());
          const items = [
            {
              id: "temp",
              note: "",
              product,
              variants,
              count,
            },
          ];

          return (
            <>
              <DrawerBody paddingX={0}>
                <ArrowLeftIcon
                  background="white"
                  boxShadow="md"
                  cursor="pointer"
                  left={0}
                  marginTop={4}
                  paddingX={4}
                  paddingY={3}
                  position="fixed"
                  roundedRight="lg"
                  top={0}
                  onClick={onClose}
                />
                {(canShare.clipboard || canShare.prompt) && (
                  <ShareIcon
                    background="white"
                    boxShadow="md"
                    cursor="pointer"
                    marginTop={4}
                    paddingX={4}
                    paddingY={3}
                    position="fixed"
                    right={0}
                    roundedLeft="lg"
                    top={0}
                    onClick={handleShare}
                  />
                )}
                {product.image && <ToggleableImage maxHeight="50vh" src={formattedImg(product.image)} />}
                <Stack
                  shouldWrapChildren
                  direction="column"
                  flex={1}
                  marginTop={product.image ? 0 : 0}
                  paddingTop={4}
                  paddingX={{base: 4, sm: 12}}
                  spacing={6}
                >
                  <Stack spacing={2}>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      lineHeight="normal"
                      overflowWrap="break-word"
                    >
                      {product.title}
                    </Text>
                    {product.type != "unavailable" && (
                      <Stack>
                        <Box
                          color="green.500"
                          fontWeight={700}
                          fontSize="2xl"
                        >
                          {`${p(product.price)}`}
                          {(product.numPiezas > 1 && 
                              <Box display="inline-block" verticalAlign="sub" ml={2}>
                                <Text display="block" color="gray.500" fontSize="xs" lineHeight={0} fontWeight={500}>{product.numPiezas > 1 ? "CADA PIEZA" : ""}</Text>
                                <Text
                                  display="block"
                                  color="gray.500"
                                  fontSize="lg"
                                  fontWeight={500}
                                  textDecoration="line-through"
                                >
                                  {`${p(product.originalPrice)}`}
                                </Text>
                              </Box>)
                            ||
                              <Text
                                display="inline"
                                color="gray.500"
                                fontSize="xl"
                                fontWeight={500}
                                ml={2}
                                textDecoration="line-through"
                              >
                                {`${p(product.originalPrice)}`}
                              </Text>
                          }
                          
                          {product.lastStock && (
                                  <Box float="right">
                                    <Text px={2} bg="#00aaf3" color="#fff" fontWeight="bold" fontSize="md" fontStyle="italic">¡ULTIMO STOCK!</Text>
                                    <Text px={2} bg="#0073bf" color="#fff" fontWeight="bold" fontSize="xs" fontStyle="italic" float="right">{product.lastStock} PIEZAS</Text>
                                  </Box>)
                            ||  product.priceOff && (
                                  <Box float="right">
                                    <Text px={2} bg="#d90000" color="#fff200" fontWeight="bold" fontSize="lg" fontStyle="italic">-{(100*(product.priceOff-product.price)/product.priceOff) | 0 }% Dcto</Text>
                                    <Text px={2} bg="#d90000" color="#fff" fontWeight="bold" fontSize="xs" fontStyle="italic" float="right">Antes {p(product.priceOff)}</Text>
                                  </Box>)
                            ||  product.isnew && (
                                  <Flex float="right" px={2} bg="#d90000" color="#fff" fontWeight="bold" fontSize="lg" fontStyle="italic">¡NUEVO!</Flex>) 
                            ||  product.isPreOrder && (
                                  <Flex float="right" px={2} bg="#ffe600" color="#013d81" fontWeight="bold" fontSize="lg" fontStyle="italic">PRE-VENTA</Flex>)
                          }
                        </Box>
                        <Flex>
                          {(product.numPiezas > 1 && 
                              <Box borderWidth='2px' borderRadius='sm' borderColor='black' px={4} py='1px' mt="-9px" fontWeight={600}>
                                {`USTED GANA... ${p(product.originalPrice - (product.price / product.numPiezas))} Por Pieza`}
                              </Box>)
                            || 
                              <Box borderWidth='2px' borderRadius='sm' borderColor='black' px={4} py='1px' mt="-9px" fontWeight={600}>
                                {`USTED GANA... ${p(product.originalPrice - product.price)}`}
                              </Box>
                          }
                          
                        </Flex>
                        <Text
                          color="gray.500"
                          fontSize="md"
                          whiteSpace="pre-line"
                        >
                          {`Ref: ${product.code}`}
                        </Text>
                        <Grid marginTop={2} marginBottom={4} templateColumns='3fr 2fr' borderWidth={1} borderColor='gray.300'>
                          <Box bg='gray.100' isTruncated padding={2} fontWeight='bold' borderBottomWidth={1} borderColor='gray.300'>Volumen de compra</Box>
                          <Box bg='gray.100' isTruncated padding={2} fontWeight='bold' borderBottomWidth={1} borderLeftWidth={1} borderColor='gray.300'>Ahorro</Box>
                          <Box bg='white' isTruncated padding={2} borderBottomWidth={1} borderColor='gray.300'>Invierte S/500 (o más)</Box>
                          <Box bg='white' isTruncated padding={2} borderBottomWidth={1} borderLeftWidth={1} borderColor='gray.300' color='#fd0000'>2% de descuento</Box>
                          <Box bg='white' isTruncated padding={2} borderBottomWidth={1} borderColor='gray.300'>Invierte S/1500 (o más)</Box>
                          <Box bg='white' isTruncated padding={2} borderBottomWidth={1} borderLeftWidth={1} borderColor='gray.300' color='#fd0000'>3% de descuento</Box>
                          <Box bg='white' isTruncated padding={2} borderBottomWidth={1} borderColor='gray.300'>Invierte S/3200 (o más)</Box>
                          <Box bg='white' isTruncated padding={2} borderBottomWidth={1} borderLeftWidth={1} borderColor='gray.300' color='#fd0000'>4% de descuento</Box>
                          <Box bg='white' isTruncated padding={2}>Invierte S/6000 (o más)</Box>
                          <Box bg='white' isTruncated padding={2} borderLeftWidth={1} borderColor='gray.300' color='#fd0000'>5% de descuento</Box>
                        </Grid> 
                      </Stack>
                    )}
                    {product.type === "unavailable" && (
                      <Stack>
                        <Box w="fit-content" float="right" px={2} bg="black" color="white" fontWeight="bold" fontSize="sm" fontStyle="italic">PRODUCTO SIN STOCK</Box>
                        <Text
                          backgroundColor= "#ebf8ff"
                          borderWidth="1px"
                          fontSize="md"
                          whiteSpace="pre-line"
                          p={3}
                        >
                          Este producto se agotó rápidamente<br/>
                          <Link
                            isExternal
                            fontWeight={900}
                            href={`https://wa.me/51935687208?text=${encodeURIComponent('Hola! Quisiera saber si traerán nuevamente el producto: '+product.title+' ('+product.code+')')}`}
                            lineHeight="normal"
                          >
                            👉 Consultar Disponibilidad
                          </Link>
                        </Text>
                      </Stack>
                    )}
                  </Stack>
                  {product.options?.length ? form : null}
                  {/*product.type != "unavailable" && (
                    <Flex alignItems="center" justifyContent="space-between">
                      <FormLabel padding={0}>{t("common.count")}</FormLabel>
                      <Stepper min={1} value={count} onChange={setCount} />
                    </Flex>
                  )*/}
                  {flags.includes("note") && (
                    <FormControl
                      help={t("cartItemDrawer.comments.placeholder")}
                      label={t("cartItemDrawer.comments.label")}
                    >
                      <Textarea
                        max={140}
                        placeholder={t("cartItemDrawer.comments.placeholder")}
                        value={note}
                        onChange={handleNoteChange}
                      />
                    </FormControl>
                  )}
                </Stack>
              </DrawerBody>
              <DrawerFooter>
                {["unavailable", "available", "promotional", "variant"].includes(product.type) && (
                  <SimpleGrid columns={1} w='100%' spacingY='20px'>
                    <Flex alignItems="center" justifyContent="space-between" >
                      <FormLabel padding={0}>{t("common.count")}</FormLabel>
                      <Stepper min={1} value={count} onChange={setCount} />
                    </Flex>
                    <SummaryButton
                      isDisabled={product.type === "unavailable"}
                      isLoading={isLoading}
                      items={items}
                      onClick={(event) => {
                        event.stopPropagation();

                        submit();
                      }}
                    >
                      ➕ {t("common.add")}
                    </SummaryButton>
                   </SimpleGrid>
                )}
                {product.type === "ask" && (
                  <Button
                    boxShadow="lg"
                    size="lg"
                    variantColor="primary"
                    width="100%"
                    onClick={(event) => {
                      event.stopPropagation();

                      submit();
                    }}
                  >
                    {t("common.add")}
                  </Button>
                )}
              </DrawerFooter>
            </>
          );
        }}
      </ProductVariantForm>
    </Drawer>
  );
};

export default CartItemDrawer;
