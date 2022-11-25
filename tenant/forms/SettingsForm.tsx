import React from "react";
import {useForm, Controller, FieldError} from "react-hook-form";
import {Stack, Text, Divider} from "@chakra-ui/core";

import {ClientTenant} from "../types";
import FieldsInput, {validator as FieldsInputValidator} from "../inputs/Fields";
import LayoutInput from "../inputs/Layout";

import {CATEGORIES} from "~/app/constants/catalogs";
import Select from "~/ui/inputs/Select";
import Input from "~/ui/inputs/Input";
import Textarea from "~/ui/inputs/Textarea";
import ColorRadio from "~/ui/inputs/ColorRadio";
import ImageInput from "~/ui/inputs/Image";
import FormControl from "~/ui/form/FormControl";
import MPConnect from "~/payment/inputs/MPConnect";
//import PlaceInput from "~/ui/inputs/Place";
import {COUNTRIES} from "~/i18n/constants";
import {useTranslation} from "~/i18n/hooks";
import PixelInput, {
  info as PixelInputInfo,
  validator as PixelInputValidator,
} from "~/ui/inputs/Pixel";
import GoogleAnalyticsInput, {
  info as GoogleAnalyticsInputInfo,
  validator as GoogleAnalyticsInputValidator,
} from "~/ui/inputs/GoogleAnalytics";

interface Props {
  defaultValues: Partial<ClientTenant>;
  onSubmit: (values: ClientTenant) => void;
  children: (options: {
    form: JSX.Element;
    isLoading: boolean;
    submit: (e?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  }) => JSX.Element;
}

const SettingsForm: React.FC<Props> = ({defaultValues = {}, children, onSubmit}) => {
  const {handleSubmit: submit, errors, register, control, formState} = useForm<ClientTenant>({
    defaultValues,
  });
  const t = useTranslation();

  function handleSubmit(values: ClientTenant) {
    const tenant = {...defaultValues, ...values};

    return onSubmit(tenant);
  }

  return children({
    isLoading: formState.isSubmitting,
    submit: submit(handleSubmit),
    form: (
      <form onSubmit={submit(handleSubmit)}>
        <Stack spacing={8}>
          <Stack spacing={4}>
            <Text fontSize="2xl" fontWeight={500} id="basic">
              {t("admin.shop.basicInformation.title")}
            </Text>
            <FormControl
              isRequired
              error={errors.title && t("admin.shop.basicInformation.businessNameError")}
              help={t("admin.shop.basicInformation.businessNameHelp")}
              label={t("admin.shop.basicInformation.businessName")}
              name="title"
            >
              <Input
                ref={register({required: true, maxLength: 70})}
                defaultValue=""
                maxLength={70}
                name="title"
                placeholder="Al's Patisseries"
              />
            </FormControl>
            <FormControl
              error={errors.description && t("admin.shop.basicInformation.descriptionError")}
              label={t("admin.shop.basicInformation.description")}
              name="description"
            >
              <Textarea
                ref={register({maxLength: 140})}
                defaultValue=""
                maxLength={140}
                name="description"
                placeholder={t("admin.shop.basicInformation.descriptionPlaceholder")}
              />
            </FormControl>
            <FormControl
              error={errors.highlight && t("admin.shop.basicInformation.highlightError")}
              help={t("admin.shop.basicInformation.highlightHelp")}
              label={t("admin.shop.basicInformation.highlight")}
              name="highlight"
            >
              <Input
                ref={register({maxLength: 140})}
                defaultValue=""
                maxLength={140}
                name="highlight"
                placeholder={t("admin.shop.basicInformation.highlightPlaceholder")}
              />
            </FormControl>
            <FormControl
              isRequired
              error={errors.phone && (errors.phone.message || t("admin.shop.basicInformation.whatsappError"))}
              help={t("admin.shop.basicInformation.whatsappHelp")}
              isInvalid={Boolean(errors.phone)}
              label="WhatsApp"
              name="phone"
            >
              <Input
                ref={register({required: true, pattern: /^[0-9]+$/})}
                defaultValue=""
                min={0}
                name="phone"
                placeholder="5491144444444"
                type="number"
              />
            </FormControl>
            <FormControl
              isRequired
              error={errors.category && t("admin.shop.basicInformation.categoryError")}
              help={t("admin.shop.basicInformation.categoryHelp")}
              label={t("admin.shop.basicInformation.category")}
              name="category"
            >
              <Select
                ref={register({required: true})}
                defaultValue=""
                name="category"
                placeholder={t("admin.shop.basicInformation.categoryPlaceholder")}
              >
                {CATEGORIES.map((value) => (
                  <option key={value} value={value}>
                    {t(`catalogs.categories.${value}`)}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl help={t("admin.shop.basicInformation.keywordsHelp")} label={t("admin.shop.basicInformation.keywords")} name="keywords">
              <Input
                ref={register}
                defaultValue=""
                name="keywords"
                placeholder={t("admin.shop.basicInformation.keywordsPlaceholder")}
              />
            </FormControl>
            <FormControl
              isRequired
              error={errors.country && t("admin.shop.basicInformation.countryError")}
              help={t("admin.shop.basicInformation.countryHelp")}
              label={t("admin.shop.basicInformation.country")}
              name="country"
            >
              <Select
                ref={register({required: true})}
                defaultValue=""
                name="country"
                placeholder={t("admin.shop.basicInformation.countryPlaceholder")}
              >
                {Object.entries(COUNTRIES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl
              help={t("admin.shop.basicInformation.addressHelp")}
              label={t("admin.shop.basicInformation.address")}
              name="place"
            >
			       <Input
                ref={register}
                defaultValue=""
                name="place"
                placeholder={t("admin.shop.basicInformation.addressPlaceholder")}
              />
              <Input
                ref={register}
                defaultValue=""
                name="placeUrl"
                mt={2}
                placeholder={"URL: https://goo.gl/maps/..."}
              />
            </FormControl>
          </Stack>
          <Divider />
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Text fontSize="2xl" fontWeight={500} id="customization">
                {t("admin.shop.personalize.title")}
              </Text>
              <Text color="gray.600">{t("admin.shop.personalize.span")}</Text>
            </Stack>
            <FormControl label="Logo" name="logo">
              <Controller
                as={ImageInput}
                control={control}
                defaultValue=""
                name="logo"
                quality="low"
              />
            </FormControl>
            <FormControl
              help={t("admin.shop.personalize.bannerHelp")}
              label={t("admin.shop.personalize.banner")}
              name="banner"
            >
              <Controller
                as={ImageInput}
                control={control}
                defaultValue=""
                height={32}
                name="banner"
                quality="high"
                width={64}
              />
            </FormControl>
            <FormControl
              isRequired
              error={errors.color && t("admin.shop.personalize.colorError")}
              label={t("admin.shop.personalize.color")}
            >
              <Controller
                as={ColorRadio}
                control={control}
                defaultValue="teal"
                name="color"
                rules={{required: true}}
              />
            </FormControl>
            <FormControl
              isRequired
              error={errors.layout && t("admin.shop.personalize.layoutError")}
              help={t("admin.shop.personalize.layoutHelp")}
              label={t("admin.shop.personalize.layout")}
              name="layout"
            >
              <Controller
                as={LayoutInput}
                control={control}
                defaultValue="portrait"
                name="layout"
              />
            </FormControl>
          </Stack>
          <Divider />
          <Stack spacing={4}>
            <Text fontSize="2xl" fontWeight={500} id="social">
              {t("admin.shop.socialNetworks.title")}
            </Text>
            <FormControl
              error={errors.instagram?.message}
              label={t("admin.shop.socialNetworks.insta")}
              name="instagram"
            >
              <Input
                ref={register({
                  validate: (value) =>
                    value.includes("instagram.com") 
                      ? String(t("admin.shop.socialNetworks.instaOnlyUser")) 
                      : value.includes("@") 
                      ? String(t("admin.shop.socialNetworks.instaNotAt")) 
                      : true,
                })}
                defaultValue=""
                name="instagram"
                placeholder={t("admin.shop.socialNetworks.userPlaceholder")}
              />
            </FormControl>
            <FormControl
              error={errors.facebook?.message}
              label={t("admin.shop.socialNetworks.fb")}
              name="facebook"
            >
              <Input
                ref={register({
                  validate: (value) =>
                    value.includes("facebook.com") ? String(t("admin.shop.socialNetworks.fbOnlyUser")) : true,
                })}
                defaultValue=""
                name="facebook"
                placeholder={t("admin.shop.socialNetworks.userPlaceholder")}
              />
            </FormControl>
            <FormControl error={errors.twitter?.message} label={t("admin.shop.socialNetworks.twt")} name="twitter">
              <Input
                ref={register({
                  validate: (value) =>
                    value.includes("twitter.com")
                      ? String(t("admin.shop.socialNetworks.twtOnlyUser"))
                      : value.includes("@")
                      ? String(t("admin.shop.socialNetworks.twtNotAt"))
                      : true,
                })}
                defaultValue=""
                name="twitter"
                placeholder={t("admin.shop.socialNetworks.userPlaceholder")}
              />
            </FormControl>
          </Stack>
          <Divider />
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Text fontSize="2xl" fontWeight={500} id="fields">
                {t("admin.shop.additionalFields.title")}
              </Text>
              <Text color="gray.600">
                {t("admin.shop.additionalFields.span")}
              </Text>
            </Stack>
            <FormControl name="fields">
              <Controller
                as={FieldsInput}
                control={control}
                defaultValue={[]}
                error={(errors.fields as unknown) as FieldError}
                name="fields"
                rules={{validate: FieldsInputValidator}}
              />
            </FormControl>
          </Stack>
          {defaultValues.flags?.includes("mercadopago") && (
            <>
              <Divider />
              <Stack marginY={8} spacing={4}>
                <Stack spacing={1}>
                  <Text fontSize="2xl" fontWeight={500} id="mercadopago">
                    Mercado Pago
                  </Text>
                  <Text color="gray.600">
                    Tenes la opción de conectar a Mercado Pago a tu tienda. Esto permitirá que le
                    generemos un link de pago a tus clientes luego e que hayan hecho su pedido.
                  </Text>
                </Stack>
                <FormControl name="mercadopago">
                  <Controller
                    as={MPConnect}
                    control={control}
                    defaultChecked={false}
                    id={defaultValues.id}
                    name="mercadopago"
                    slug={defaultValues.slug}
                  />
                </FormControl>
              </Stack>
            </>
          )}
          <Divider />
          <Stack marginTop={8} spacing={4}>
            <Stack spacing={1}>
              <Text fontSize="2xl" fontWeight={500} id="advanced">
                {t("admin.shop.advancedOptions.title")}
              </Text>
              <Text color="gray.600">{t("admin.shop.advancedOptions.span")}</Text>
            </Stack>
            <FormControl
              error={errors.pixel?.message}
              help={t("admin.shop.advancedOptions.fbHelp")}
              info={<PixelInputInfo />}
              label={t("admin.shop.advancedOptions.fb")}
              name="pixel"
            >
              <PixelInput
                defaultValue=""
                name="pixel"
                placeholder="333964417633206"
                register={register({validate: PixelInputValidator})}
              />
            </FormControl>
            <FormControl
              error={errors.ga?.message}
              help={t("admin.shop.advancedOptions.gaHelp")}
              info={<GoogleAnalyticsInputInfo />}
              label={t("admin.shop.advancedOptions.ga")}
              name="ga"
            >
              <GoogleAnalyticsInput
                defaultValue=""
                name="ga"
                placeholder="UA-XXXXXXXXX-X"
                register={register({validate: GoogleAnalyticsInputValidator})}
              />
            </FormControl>
            {defaultValues.flags?.includes("advanced") && (
              <FormControl
                help="Vamos a hacer un POST a esta url cada vez que un usuario complete un pedido"
                label="Webhook"
                name="hook"
              >
                <Input
                  ref={register}
                  defaultValue=""
                  name="hook"
                  placeholder="https://tuwebhook.com"
                />
              </FormControl>
            )}
          </Stack>
        </Stack>
      </form>
    ),
  });
};

export default SettingsForm;
