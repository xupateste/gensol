import React from "react";

import {Field} from "../../types";

import RadioGroup, {RadioColumn} from "~/ui/inputs/Radio";

import {useTranslation} from "~/i18n/hooks";

interface Props {
  onChange: (type: Field["type"]) => void;
  value: Field["type"];
}

const TypeInput: React.FC<Props> = ({value, onChange}) => {
  const t = useTranslation();

  return (
    <RadioGroup
      isInline
      value={value}
      onChange={(event) => onChange(event.target.value as Field["type"])}
    >
      <RadioColumn value="radio">{t("admin.shop.additionalFields.addFieldOptions")}</RadioColumn>
      <RadioColumn value="text">{t("admin.shop.additionalFields.addFieldToComplete")}</RadioColumn>
    </RadioGroup>
  );
};

export default TypeInput;
