import React from "react";

import {TextField} from "~/tenant/types";
import FormControl from "~/ui/form/FormControl";
import Input from "~/ui/inputs/Input";

interface Props {
  value: string;
  field: TextField;
  onChange: (value: string) => void;
}

const TextFieldInput: React.FC<Props> = ({value, field, onChange}) => {
  return (
    <FormControl help={field.note} isRequired={field.required} label={field.title} width="100%">
      <Input
        maxLength={50}
        paddingX={0}
        size="lg" fontSize="2xl" 
        roundedRight={0}
        value={value || ""}
        placeholder='' 
        variant="flushed"
        onChange={(event) => onChange(event.target.value || "")}
      />
    </FormControl>
  );
};

export default TextFieldInput;
