import { useEffect, useState } from "react"
import useMaakForm, { FormType, FieldType } from "../../hooks/useMaakForm"
import {
  checkboxStyling,
  defaultInputStyles,
  defaultLabelStyles,
} from "../demo-styles/component-styles"

const FormBuilder = () => {
  const [form, setForm] = useState<FormType>({})
  const [formItem, setFormItem] = useState({
    label: "New Element",
    type: "text" as FieldType,
    minLength: 1,
    maxLength: 255,
    required: true,
    defaultValue: undefined,
  })

  const { formElements, FormComponent } = useMaakForm({
    formConfig: form,
    onSubmit: () => {},
  })

  const addFormElement = () => {
    const newForm = { ...form }
    const newElementKey = "newElementKey"
    const newElement = {
      label: "New Element",
      type: "text" as FieldType,
      minLength: 1,
      maxLength: 255,
      required: true,
      defaultValue: undefined,
    }
    const key = Math.random().toString(36).substring(7)

    const updatedForm = { ...newForm, [key]: newElement }
    setForm(updatedForm)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>FormBuilder</h1>
      <div className="flex gap-4">
        <div>
          <button onClick={() => console.log(FormComponent)}>
            add element
          </button>
          <FormBuilderInput />
        </div>
        {/* <div>{FormComponent}</div> */}
      </div>
    </div>
  )
}

export default FormBuilder

const FormBuilderInput = () => {
  const [options, setOptions] = useState([])

  const { formElements, FormComponent } = useMaakForm({
    formConfig: {
      input: {
        label: "Input Type",
        type: "select",
        options: [
          { value: "text", label: "Text" },
          { value: "select", label: "Select" },
          { value: "boolean", label: "Boolean" },
        ],
        required: true,
        placeHolder: "Select a type",
      },
      label: {
        label: "Label",
        type: "text",
        options: [
          { value: "text", label: "Text" },
          { value: "select", label: "Select" },
          { value: "boolean", label: "Boolean" },
        ],
        required: true,
        placeHolder: "Add a Label",
        minLength: 2,
        maxLength: 255,
      },
      required: {
        label: "Required",
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      minLength: {
        label: "Min Length",
        type: "number",
        required: false,
        defaultValue: 1,
      },
      maxLength: {
        label: "Max Length",
        type: "number",
        required: false,
        defaultValue: 255,
      },
      className: {
        label: "Class Name",
        type: "text",
        required: false,
      },
      placeHolder: {
        label: "Place Holder",
        type: "text",
        required: false,
      },
      defaultValue: {
        label: "Default Value",
        type: "text",
        required: false,
      },
      options: {
        label: "Options",
        type: "text",
        required: false,
        placeHolder: "{ value: 'text', label: 'Text' }",
      },
      add_option: {
        label: "Add Option",
        type: "button",
        required: false,
        defaultValue: false,
        onClick: (el) => handleClick(el),
      },
      labelKey: {
        label: "Label Key",
        type: "text",
        required: false,
      },
      valueKey: {
        label: "Value Key",
        type: "text",
        required: false,
      },
      pattern: {
        label: "Pattern",
        type: "text",
        required: false,
        placeHolder: "Enter a regex pattern",
      },
    },
    setGlobalClassNames: {
      select: `${defaultInputStyles}  w-40`,
      text: defaultInputStyles,
      boolean: checkboxStyling,
      number: `${defaultInputStyles}  w-20`,
      label: defaultLabelStyles,
    },
    setFormObject: {
      options: {
        className: "w-60",
      },
      add_option: {},
    },
    onSubmit: () => {},
  })

  function handleClick(formElements: any) {
    console.log("formElements", formElements.options)
  }

  return <div>{FormComponent}</div>
}
