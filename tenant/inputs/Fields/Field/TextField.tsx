import React from "react";
import produce from "immer";

import {TextField} from "../../../types";

import FormControl from "~/ui/form/FormControl";
import Input from "~/ui/inputs/Input";

import {useTranslation} from "~/i18n/hooks";


interface Props {
  value: Partial<TextField>;
  onChange: (value: Partial<TextField>) => void;
  error?: {
    index: number;
    type: string;
    message: string;
  };
}

const TextFieldInput: React.FC<Props> = ({value, onChange}) => {
  const t = useTranslation();

  function handleChange(note) {
    onChange(
      produce(value, (value) => {
        value.note = note;
      }),
    );
  }

  return (
    <FormControl help={t("admin.shop.additionalFields.addFieldNoteHelp")} label={t("admin.shop.additionalFields.addFieldNote")} width="100%">
      <Input
        maxLength={70}
        placeholder={t("admin.shop.additionalFields.addFieldNotePlaceholder")}
        roundedRight={0}
        value={value.note}
        onChange={(event) => handleChange(event.target.value || "")}
      />
    </FormControl>
  );
};

export default TextFieldInput;
