import { useEffect, useState } from "react"
import useMaakForm, {
  FormType,
  FieldType,
  FormObject,
  ValueOptions,
  OptionType,
  FormElement,
  FieldConfig,
} from "../../hooks/useMaakForm"
import {
  defaultButtonStyling,
  defaultCheckboxStyling,
  defaultInputStyling,
  defaultLabelStyling,
  defaultResetButtonStyling,
  defaultSubmitButtonStyling,
} from "../demo-styles/component-styles"

const FormBuilder = () => {
  const [form, setForm] = useState<FormType>({})

  const { formElements, FormComponent } = useMaakForm({
    key: "form-builder",
    formConfig: {
      required: {
        label: "Required",
        type: "boolean",
        required: false,
      },
      submit: {
        className: `${defaultSubmitButtonStyling} whitespace-nowrap w-fit`,
        type: "button",
        label: "Add Element",
        required: true,
      },
      reset: {
        className: `${defaultResetButtonStyling} whitespace-nowrap w-fit`,
        type: "button",
        label: "Reset Input",
      },
      ...form,
    },
    setGlobalClassNames: {
      select: `${defaultInputStyling}  w-40`,
      text: defaultInputStyling,
      boolean: defaultCheckboxStyling,
      number: `${defaultInputStyling}  w-20`,
      label: defaultLabelStyling,
    },

    onSubmit: () => {},
  })

  const addFormElement = (newFormElement: FormElement) => {
    const newForm = { ...form }
    const key = newFormElement.label!.toLowerCase().split(" ").join("_")
    newForm[key] = newFormElement as FieldConfig
    setForm(newForm)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>Form Builder</h1>
      <div className="flex gap-4">
        <div className="w-1/2">
          <FormBuilderInput addFormElement={addFormElement} />
        </div>
        {FormComponent}
      </div>
    </div>
  )
}

export default FormBuilder

const FormBuilderInput = ({
  addFormElement, // setOptions,
}: {
  addFormElement: (props: FormElement) => void
}) => {
  const [options, setOptions] = useState<any[]>([])

  const { formElements, FormComponent, setFieldValue } = useMaakForm({
    formConfig: {
      type: {
        label: "Input Type",
        type: "select",
        options: [
          { value: "text", label: "Text" },
          { value: "select", label: "Select" },
          { value: "boolean", label: "Boolean" },
          { value: "number", label: "Number" },
        ],
        // defaultValue: "text",
        required: true,
        placeHolder: "Select a type",
      },
      label: {
        label: "Label",
        type: "text",
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
      pattern: {
        label: "Pattern",
        type: "text",
        required: false,
        placeHolder: "Enter a regex pattern",
      },
      options: {
        label: "Options",
        type: "text",
        required: false,
        placeHolder: "{ value: 'text', label: 'Text' }",
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
      add_option: {
        label: "Add Option",
        type: "button",
        required: false,
        defaultValue: false,
        className: defaultSubmitButtonStyling,
        onClick: (response: any) => {
          console.log("response: ", response)
          if (response.options.value === undefined) return

          try {
            const parsedOption = JSON.parse(response.options.value)
            setOptions((prevOptions) => [...prevOptions, parsedOption])
            setFieldValue("options", "")
          } catch (e) {
            console.error("Error parsing options: ", e)
          }
        },
      },
      submit: {
        className: `${defaultSubmitButtonStyling} whitespace-nowrap w-fit`,
        type: "button",
        label: "Add Element",
      },
      reset: {
        className: `${defaultResetButtonStyling} whitespace-nowrap w-fit`,
        type: "button",
        label: "Reset Input",
      },
    },
    setGlobalClassNames: {
      select: `${defaultInputStyling}  w-60`,
      text: `${defaultInputStyling}  w-60`,
      boolean: defaultCheckboxStyling,
      number: `${defaultInputStyling}  w-40`,
      label: defaultLabelStyling,
    },
    setFormObject: {
      options: {
        className: "w-60",
      },
    },
    onSubmit: () => {
      const objectToSubmit = {} as any
      const { add_option, submit, reset, ...rest } = formElements as FormObject
      for (const key in rest) {
        let value = rest[key].value as OptionType | OptionType[]
        if (key === "options") value = options as OptionType[]
        objectToSubmit[key] = value
      }
      addFormElement(objectToSubmit)
    },
  })

  return FormComponent
}
