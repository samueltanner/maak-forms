import isEqual from "lodash/isEqual"
import { isObject } from "lodash"
import {
  useState,
  ChangeEvent,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react"

export interface FormType {
  [key: string]: FieldConfig
}

export type OptionType = { [key: string]: string }

export type FieldType =
  | "boolean"
  | "bounded-range"
  | "button"
  | "date"
  | "datetime"
  | "multiselect"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "select"
  | "searchable-select"
  | "text"

export interface BaseFieldConfig {
  type: FieldType
  label?: string
  required?: boolean
  defaultValue?: ValueOptions
  className?: string
  value?: ValueOptions
  placeHolder?: string
  readonly?: boolean
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "password"
  minLength?: number
  maxLength?: number
  pattern?: string
}

export interface PasswordFieldConfig extends TextFieldConfig {
  type: "password"
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select" | "radio" | "multiselect" | "searchable-select"
  options?: OptionType[]
  labelKey?: string
  valueKey?: string
}

export interface BooleanFieldConfig extends BaseFieldConfig {
  type: "boolean"
}

export interface ButtonFieldConfig extends BaseFieldConfig {
  type: "button"
  onClick?: (props?: any) => void
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number" | "range" | "bounded-range"
  min?: number
  max?: number
  step?: number
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date" | "datetime"
  min?: number
  max?: number
  step?: number
}

export interface DateTimeFieldConfig extends DateFieldConfig {
  type: "datetime"
}

export interface RadioFieldConfig extends SelectFieldConfig {
  type: "radio"
}

export interface RangeFieldConfig extends NumberFieldConfig {
  type: "range" | "bounded-range"
}

// Union type for FieldConfig
export type FieldConfig =
  | TextFieldConfig
  | SelectFieldConfig
  | BooleanFieldConfig
  | ButtonFieldConfig
  | NumberFieldConfig
  | DateFieldConfig
  | DateTimeFieldConfig
  | PasswordFieldConfig
  | RadioFieldConfig
  | RangeFieldConfig

export type ValueOptions = string | boolean | undefined | number | OptionType
export interface FormResponse {
  [key: string]: ValueOptions
}

export interface FormErrors {
  [key: string]: string | null
}

export interface FormElement {
  [key: string]: any
  type?: FieldType
  label?: string
  value?: ValueOptions
  required?: boolean
  defaultValue?: any
  placeHolder?: string
  pattern?: string
  options?: OptionType[] | any[]
  labelKey?: string
  valueKey?: string
  className?: string
  onClick?: (response: any) => void
  min?: string | number
  max?: string | number
  minLength?: string | number
  maxLength?: string | number
  step?: string | number
  name?: string
  readonly?: boolean
}
export interface FormObject {
  [key: string]: FormElement & {
    fieldName?: string
    inputElement?: JSX.Element
    errors?: string | null
  }
}
interface FormComponentProps {
  formConfig: FormType
  onSubmit?: any
  setGlobalClassNames?: GlobalClassNames
  setFormObject?: FormObject
  key?: string
}

interface GlobalClassNames {
  [key: string]: string
}

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>

const useMaakForm = ({
  key,
  formConfig,
  onSubmit,
  setGlobalClassNames: globalClassNamesProp = {},
  setFormObject: formObjectProp = {},
}: FormComponentProps) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const [form, setForm] = useState<FormObject>(() => {
    formConfig["submit"] = {
      label: formConfig["submit"]?.label,
      type: "button",
      required: true,
      className: `${globalClassNamesProp?.button} ${
        formConfig["submit"]?.className || ""
      }`,
    }
    formConfig["reset"] = {
      label: formConfig["reset"]?.label,
      type: "button",
      required: true,
      className: `${globalClassNamesProp?.button} ${
        formConfig["reset"]?.className || ""
      }`,
    }
    return Object.keys(formConfig).reduce((values, fieldName) => {
      const field = formConfig[fieldName]
      values[fieldName] = {
        fieldName,
        inputElement: <></>,
        errors: null,
        placeHolder: field.placeHolder || "",
        defaultValue: field.defaultValue,
        value: field.defaultValue,
        label: field.label,
        type: field.type,
        options: field.type === "select" ? field.options : undefined,
        required: field.required,
        onClick: field.type === "button" ? field.onClick : undefined,
        className: field.className,
      }
      return values
    }, {} as FormObject)
  })
  const initialFormRef = useRef<FormObject>({})
  const formConfigRef = useRef<string>(JSON.stringify({}))
  const prevFormRef = useRef<FormObject>({})

  useEffect(() => {
    if (Object.keys(formConfig).length === 0) return
    const constructedForm = constructUpdatedForm(formObjectProp, formConfig)
    initialFormRef.current = constructedForm
    setForm(constructedForm)
  }, [JSON.stringify(formConfig), JSON.stringify(formObjectProp)])

  useEffect(() => {
    if (formObjectProp && !isEqual(form, formObjectProp)) {
      handleUpdateFormItem({ formObjectInput: formObjectProp })
    }
  }, [formObjectProp])

  useEffect(() => {
    formConfig["submit"]["required"] = true
    formConfig["reset"]["required"] = true
    formConfigRef.current = JSON.stringify(formConfig)
  }, [JSON.stringify(formConfig), JSON.stringify(formObjectProp)])

  useEffect(() => {
    validateForm()
  }, [form])

  const constructUpdatedForm = (input: FormObject, prevForm: FormObject) => {
    const inputFields = new Set(Object.keys(formConfig))
    const setFormObjectKeys = Object.keys(formObjectProp)
    if (setFormObjectKeys.length > 0) {
      setFormObjectKeys.forEach((key) => {
        inputFields.add(key)
      })
    }

    const updatedFormObject = {} as FormObject

    const getDefaultValue = (
      newDefaultValue: ValueOptions,
      prevDefaultValue: ValueOptions
    ) => {
      if (newDefaultValue === undefined) {
        return prevDefaultValue
      }
      return newDefaultValue
    }

    const getValue = (
      newValue: ValueOptions,
      prevValue: ValueOptions,
      defaultValue: ValueOptions
    ) => {
      if (newValue) return newValue
      if (prevValue) return prevValue

      return defaultValue
    }

    inputFields.forEach((key) => {
      const newItem = input[key]
      const prevItem = prevForm?.[key]
      const defaultValue = getDefaultValue(
        newItem?.defaultValue,
        prevItem?.defaultValue
      )
      const value = getValue(newItem?.value, prevItem?.value, defaultValue)
      updatedFormObject[key] = {
        value,
        defaultValue: newItem?.defaultValue || prevItem?.defaultValue,
        ...prevItem,
        ...newItem,
      }
    })

    initialFormRef.current = updatedFormObject
    return updatedFormObject
  }

  function constructUpdatedErrors(input: FormObject, prevForm: FormObject) {
    const updatedErrorObject = {} as FormErrors
    const inputFields = new Set(Object.keys(formConfig))
    const setFormObjectKeys = Object.keys(formObjectProp)
    if (setFormObjectKeys.length > 0) {
      setFormObjectKeys.forEach((key) => {
        inputFields.add(key)
      })
    }
    inputFields.forEach((key) => {
      updatedErrorObject[key] = validateField(key, null)
    })

    return updatedErrorObject
  }

  function handleUpdateFormItem({
    formObjectInput,
  }: {
    formObjectInput: FormObject
  }) {
    const formObjectInputString = JSON.stringify(formObjectInput)
    const previousFormValuesString = JSON.stringify(prevFormRef.current)

    if (formObjectInputString !== previousFormValuesString) {
      setForm((prevForm) => {
        const updatedForm = constructUpdatedForm(formObjectInput, prevForm)
        return updatedForm
      })

      prevFormRef.current = formObjectInput
    }
  }

  function handleChange(e: InputChangeEvent) {
    const target = e.target as HTMLInputElement
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name

    const validation = validateField(name, value)

    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [name]: {
          ...prevForm[name],
          value,
          errors: validation,
        },
      }

      return updatedForm
    })
    setShowErrors(true)
  }

  function validateField(
    fieldName: string,
    value: ValueOptions | null
  ): string | null {
    const config = formConfig[fieldName]
    const type = config.type
    const required = config?.required || false

    let valueToValidate
    switch (type) {
      case "select":
        const defaultValue = config?.defaultValue
        const currentValue = value
        const selectConfig = config as SelectFieldConfig
        const defaultOption = selectConfig.options?.find(
          (option) => option.value === defaultValue
        )
        const defaultOptionValue = defaultOption?.value
        valueToValidate = defaultOptionValue || currentValue || ""
        break
      case "boolean":
        valueToValidate = value
        break
      case "number":
        valueToValidate = value
        break
      case "button":
        valueToValidate = true
        break
      case "text":
      default:
        valueToValidate = value || ""
        break
    }

    let errorMessage = null as string | null
    if (required && (valueToValidate === "" || valueToValidate === null)) {
      errorMessage = `${config.label} is required`
    }
    if (typeof valueToValidate === "string" && required) {
      const minLengthValue = (config as TextFieldConfig).minLength
      const maxLengthValue = (config as TextFieldConfig).maxLength

      let minLength =
        minLengthValue !== undefined
          ? typeof minLengthValue === "string"
            ? +minLengthValue
            : minLengthValue
          : undefined

      let maxLength =
        maxLengthValue !== undefined
          ? typeof maxLengthValue === "string"
            ? +maxLengthValue
            : maxLengthValue
          : undefined

      if (type === "text" && minLength && valueToValidate.length < minLength) {
        errorMessage = `Minimum length is ${minLength}`
      }
      if (type === "text" && maxLength && valueToValidate.length > maxLength) {
        errorMessage = `Maximum length is ${maxLength}`
      }
      if (["text", "password"].includes(type)) {
        const pattern = (config as TextFieldConfig).pattern
        if (
          typeof pattern === "string" &&
          !new RegExp(pattern).test(valueToValidate)
        ) {
          errorMessage = "Invalid format"
        }
      }
    }

    if (errorMessage) {
      setFormErrors((prevErrors) => {
        const updatedErrors = {
          ...prevErrors,
          [fieldName]: errorMessage,
        }

        return updatedErrors
      })
      return errorMessage
    }
    setFormErrors((prevErrors) => {
      const updatedErrors = {
        ...prevErrors,
        [fieldName]: null,
      }

      return updatedErrors
    })
    return null
  }

  function validateForm() {
    const errors: FormErrors = {}

    Object.keys(form).forEach((fieldName) => {
      const value = form?.[fieldName]?.value || form?.[fieldName]?.defaultValue
      const error = validateField(fieldName, value)

      if (error) {
        errors[fieldName] = error
      } else {
        errors[fieldName] = null
      }
    })

    setFormErrors(errors)
    return errors
  }

  const handleClickInternal = (action?: any) => {
    const formData = { ...form }
    action(formData)
  }

  const handleAsyncClickInternal = async (action?: any) => {
    const formData = { ...form }
    await action(formData)
  }

  const FormButton = useCallback(
    ({
      type,
      className = undefined,
      label,
      onClick,
      enabled,
      fieldName = "",
    }: {
      forObject?: boolean
      type?: "button" | "submit" | "reset" | undefined
      className?: string
      label?: string
      onClick?: (props?: any) => void
      enabled?: boolean
      fieldName?: string
    }) => {
      return (
        <button
          className={`${
            form?.[fieldName]?.className ||
            className ||
            globalClassNamesProp?.button
          } ${!enabled ? "cursor-not-allowed opacity-50" : "opacity-100"}`}
          onClick={() => {
            if (onClick && enabled) {
              onClick()
            }
          }}
          type={type}
        >
          <p>{label}</p>
        </button>
      )
    },
    [form, formConfig, globalClassNamesProp, formConfigRef, formErrors]
  )

  const createInputElement = useCallback(
    (fieldName: string, config: FieldConfig): JSX.Element => {
      const field = form[fieldName]
      const type = form[fieldName].type as FieldType
      const placeHolder = field?.placeHolder || config?.placeHolder || ""
      const fieldValue = field?.value ?? field?.defaultValue ?? ""
      const className = `${globalClassNamesProp?.[type]} ${form[fieldName]?.className}`
      const label = field?.label || config?.label || ""
      const onClick = field?.onClick || (config as ButtonFieldConfig)?.onClick
      const value = field?.value || field?.defaultValue || ""

      let inputProps = {
        name: fieldName,
        onChange: handleChange,
        className,
        label,
      }

      switch (type) {
        case "select":
          const options =
            field?.options || (config as SelectFieldConfig).options || []
          const labelKey =
            field?.labelKey ||
            (config as SelectFieldConfig)?.labelKey ||
            "label"
          const valueKey =
            field?.valueKey ||
            (config as SelectFieldConfig)?.valueKey ||
            "value"
          const selectFieldValue = String(fieldValue)

          return (
            <select {...inputProps} value={selectFieldValue}>
              {!options.find((opt) => opt[valueKey] === "" || value) && (
                <option value="" disabled>
                  {(placeHolder as string) || "Select an option"}
                </option>
              )}

              {options.map((option) => (
                <option key={option[valueKey]} value={option[valueKey]}>
                  {option[labelKey]}
                </option>
              ))}
            </select>
          )
        case "boolean":
          return (
            <input
              {...inputProps}
              type="checkbox"
              checked={Boolean(fieldValue)}
            />
          )
        case "button":
          return (
            <FormButton
              type="button"
              label={label}
              onClick={() => handleClickInternal(onClick)}
              enabled={true}
              className={className}
            />
          )
        case "number":
          return (
            <input
              {...inputProps}
              type="number"
              value={fieldValue as number}
              placeholder={config?.placeHolder || (placeHolder as string)}
              min={(config as NumberFieldConfig)?.min}
              max={(config as NumberFieldConfig)?.max}
              required={config?.required}
            />
          )
        case "date":
          return (
            <input
              {...inputProps}
              type="date"
              value={fieldValue as string}
              placeholder={placeHolder as string}
              min={(config as DateFieldConfig)?.min}
              max={(config as DateFieldConfig)?.max}
              required={config?.required}
            />
          )
        case "text":
        default:
          return (
            <input
              {...inputProps}
              type="text"
              value={fieldValue as string}
              placeholder={placeHolder as string}
              minLength={(config as TextFieldConfig)?.minLength}
              maxLength={(config as TextFieldConfig)?.maxLength}
              required={config?.required}
            />
          )
      }
    },
    [
      form,
      globalClassNamesProp,
      handleChange,
      formConfig,
      formConfigRef,
      formErrors,
    ]
  )

  const handleSubmitInternal = useCallback(() => {
    const transformedFormValues = Object.fromEntries(
      Object.entries(form).map(([key, val]) => {
        if (val && typeof val === "object" && "value" in val) {
          return [key, val.value]
        }
        return [key, val]
      })
    )

    const errors = Object.keys(formErrors).length > 0 ? formErrors : null

    if (errors && Object.values(errors).some((error) => error !== null)) {
      throw new Error("Form validation errors")
    } else {
      const { submit, reset, ...formValues } = transformedFormValues
      formValues as FormResponse
      onSubmit(formValues)
    }
  }, [validateForm, onSubmit])

  function handleResetInternal() {
    const originalFormState = initialFormRef.current
    if (Object.keys(originalFormState).length === 0) {
      console.warn("initialForm is empty")
    } else {
      setForm(originalFormState)
    }
    setShowErrors(false)
  }

  const determineKey = (field: FormElement) => {
    const defaultKey = field?.valueKey || "value"
    const alternatives = ["key", "id"]

    if (defaultKey in field) {
      return defaultKey
    }

    if (isObject(field.value)) {
      for (const key of alternatives) {
        if (key in field.value) {
          return key
        }
      }
    }

    const fieldValue = field[defaultKey]
    if (
      typeof fieldValue === "string" ||
      typeof fieldValue === "number" ||
      typeof fieldValue === "boolean"
    ) {
      return defaultKey
    } else {
      console.log(field)
      throw new Error(
        `Unable to determine a key for ${
          field.fieldName || field.label || field.name
        }, please provide a "valueKey" for this field.`
      )
    }
  }

  const formObject = useMemo(() => {
    const obj: FormObject = {}
    const submitEnabled = Object.values(formErrors).every(
      (field) => field === null
    )

    Object.keys(form).forEach((fieldName) => {
      const field = form[fieldName]
      const fieldType = field.type || "text"
      let value: ValueOptions

      if (
        ["select", "radio", "multiselect", "searchable-select"].includes(
          fieldType
        ) &&
        typeof field.value === "object" &&
        field.value !== null &&
        isObject(field.value)
      ) {
        const valueKey = determineKey(field)

        value = field.value[valueKey]
      } else {
        value = field.value
      }

      obj[fieldName] = {
        fieldName,
        inputElement: createInputElement(fieldName, formConfig[fieldName]),
        value: field?.value,
        errors: field?.errors,
        placeHolder: field?.placeHolder,
        defaultValue: field?.defaultValue,
        label: field?.label,
        className: field?.className,
        type: field?.type,
        options: field?.options,
      }
    })

    obj["submit"] = {
      fieldName: "submit",
      type: "button",
      inputElement: (
        <FormButton
          type="button"
          label={form["submit"]?.label}
          onClick={handleSubmitInternal}
          enabled={submitEnabled}
          className={`${
            form["submit"]?.className || globalClassNamesProp?.button
          } ${
            !submitEnabled ? "cursor-not-allowed opacity-50" : "opacity-100"
          }`}
        />
      ),
    }

    obj["reset"] = {
      fieldName: "reset",
      type: "button",
      inputElement: (
        <FormButton
          enabled={true}
          type="reset"
          label={form["reset"]?.label || "Reset"}
          onClick={handleResetInternal}
          className={form["reset"]?.className || globalClassNamesProp?.button}
        />
      ),
    }

    return obj
  }, [
    formConfig,
    createInputElement,
    handleSubmitInternal,
    handleResetInternal,
    form,
    globalClassNamesProp,
    formObjectProp,
    initialFormRef,
  ])

  const FormComponent = useMemo(() => {
    const submitEnabled = Object.values(formErrors).every(
      (field) => field === null
    )

    return (
      <form
        onSubmit={handleSubmitInternal}
        className="flex flex-col gap-4"
        key={key}
      >
        <div className="flex flex-col gap-4">
          {Object.keys(form).map((fieldName) => {
            const field = form[fieldName]
            const required = field?.required || false
            const label =
              typeof field?.label === "string" ? field?.label : fieldName
            const formFieldObject = form[fieldName]
            const type = formFieldObject?.type || "text"
            const errors = formFieldObject?.errors || formErrors[fieldName]
            if (!["reset", "submit"].includes(fieldName)) {
              return (
                <div key={fieldName} className="flex flex-col gap-2">
                  {type !== "button" && (
                    <div className="flex justify-between">
                      <label
                        htmlFor={label}
                        className={`${globalClassNamesProp?.label} whitespace-nowrap`}
                      >
                        {label} {required && "*"}
                      </label>
                      {/* <span className="flex h-2 w-full justify-end font-semibold">
                        {showErrors && errors && (
                          <span className="text-xs text-red-500">{errors}</span>
                        )}
                      </span> */}
                    </div>
                  )}
                  <div
                    className={`flex h-full items-center justify-start ${
                      type === "button" && "mt-[25%]"
                    }
                    ${type === "boolean" && "ml-2"}
                    `}
                  >
                    {formFieldObject &&
                      createInputElement(
                        fieldName,
                        formFieldObject as FieldConfig
                      )}
                  </div>
                  {showErrors && errors && (
                    <span className="flex h-2 w-full justify-start font-semibold">
                      <span className="text-xs text-red-500">{errors}</span>
                    </span>
                  )}
                </div>
              )
            }
          })}
        </div>
        <div className="flex w-fit justify-between gap-4">
          <FormButton
            type="reset"
            label={form["reset"]?.label || "Reset"}
            onClick={handleResetInternal}
            className={form["submit"]?.className}
            fieldName="reset"
            enabled={true}
          />
          <FormButton
            type="button"
            label={form["submit"]?.label || "Submit"}
            onClick={handleSubmitInternal}
            className={form["submit"]?.className}
            fieldName="submit"
            enabled={submitEnabled}
          />
        </div>
      </form>
    )
  }, [formConfig, form, initialFormRef, createInputElement, formObjectProp])

  const setFieldValue = useCallback(
    (fieldName: string, value: ValueOptions) => {
      setForm((prevForm) => {
        const updatedForm = {
          ...prevForm,
          [fieldName]: {
            ...prevForm[fieldName],
            value,
          },
        }

        return updatedForm
      })
    },
    [form]
  )

  return {
    submitForm: handleSubmitInternal,
    resetForm: handleResetInternal,
    handleChange,
    validateForm,
    formErrors,
    onSubmitForm: onSubmit,
    createInputElement,
    FormComponent,
    formElements: formObject,
    setFieldValue,
  }
}

export default useMaakForm
