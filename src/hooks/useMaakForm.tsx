import isEqual from "lodash/isEqual"
import React, {
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

type OptionType = { value: string; label: string }
type FieldType = "text" | "select" | "boolean" | "button" | "number"

interface FieldConfig {
  type: FieldType
  label?: string
  options?: OptionType[]
  required: boolean
  defaultValue?: ValueOptions
  placeHolder?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  className?: string
  labelKey?: string
  valueKey?: string
}

type ValueOptions = string | boolean | undefined | OptionType | number

interface FormErrors {
  [key: string]: string | null
}

interface FormComponentProps {
  formConfig: FormType
  onSubmit?: any
  globalClassNames?: GlobalClassNames
  setFormObject?: FormObject
}

interface GlobalClassNames {
  [key: string]: string
}

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>

interface FormObject {
  [key: string]: {
    fieldName?: string
    inputElement?: JSX.Element
    errors?: string | null
    placeHolder?: ValueOptions
    defaultValue?: ValueOptions
    value?: ValueOptions
    label?: string
    className?: string
    type?: FieldType
    options?: any[]
    labelKey?: string
    valueKey?: string
    required?: boolean
  }
}

export const deepEqual = (obj1: any, obj2: any) => {
  if (obj1 === obj2) return true

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false
    for (let item of obj1) {
      if (!obj2.includes(item)) return false
    }
    for (let item of obj2) {
      if (!obj1.includes(item)) return false
    }
    return true
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

const useMaakForm = ({
  formConfig,
  onSubmit,
  globalClassNames,
  setFormObject,
}: FormComponentProps) => {
  const [form, setForm] = useState<FormObject>(() => {
    formConfig["submit"] = {
      label: "submit",
      type: "button",
      required: true,
    }
    formConfig["reset"] = {
      label: "reset",
      type: "button",
      required: true,
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
      }
      return values
    }, {} as FormObject)
  })

  useEffect(() => {
    if (setFormObject && !isEqual(form, setFormObject)) {
      handleUpdateFormItem(setFormObject)
    }
  }, [setFormObject])

  const prevFormRef = useRef<FormObject>({})
  function handleUpdateFormItem(formObjectInput: FormObject) {
    const formObjectInputString = JSON.stringify(formObjectInput)
    const previousFormValuesString = JSON.stringify(prevFormRef.current)

    if (formObjectInputString !== previousFormValuesString) {
      setForm((prevForm) => {
        const updatedForm = Object.keys(formObjectInput).reduce(
          (newForm, key) => {
            const inputItem = formObjectInput[key]
            const prevFormItem = prevForm[key]

            if (prevFormItem) {
              const newValue =
                inputItem.value !== undefined
                  ? inputItem.value
                  : inputItem.defaultValue !== undefined
                  ? inputItem.defaultValue
                  : prevFormItem.value

              const placeHolder =
                inputItem.placeHolder !== undefined
                  ? inputItem.placeHolder
                  : prevFormItem.placeHolder

              const newOptions =
                inputItem.options !== undefined
                  ? inputItem.options
                  : prevFormItem.options

              newForm[key] = {
                ...prevFormItem,
                ...inputItem,
                value: newValue,
                placeHolder,
                ...(newOptions && { options: newOptions }),

                required:
                  inputItem.required !== undefined
                    ? inputItem.required
                    : prevFormItem.required,
              }
            } else {
              newForm[key] = {
                ...inputItem,

                placeHolder:
                  inputItem.placeHolder !== undefined
                    ? inputItem.placeHolder
                    : "",
              }
            }

            return newForm
          },
          { ...prevForm }
        )

        return updatedForm
      })

      prevFormRef.current = formObjectInput
    }
  }

  function handleChange(e: InputChangeEvent) {
    const target = e.target as HTMLInputElement
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name

    const errors = validateField(name, value)

    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [name]: {
          ...prevForm[name],
          value,
          errors,
        },
      }
      return updatedForm
    })
  }

  function validateField(
    fieldName: string,
    value: ValueOptions
  ): string | null {
    const config = formConfig[fieldName]

    const valueToValidate =
      typeof value === "object" && value !== null ? value.value : value

    if (config.required && valueToValidate === "") {
      return `${config.label} is required`
    }
    if (typeof valueToValidate === "string") {
      if (config.minLength && valueToValidate.length < config.minLength) {
        return `Minimum length is ${config.minLength}`
      }
      if (config.maxLength && valueToValidate.length > config.maxLength) {
        return `Maximum length is ${config.maxLength}`
      }
      if (config.pattern && !new RegExp(config.pattern).test(valueToValidate)) {
        return "Invalid format"
      }
    }
    return null
  }

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {}

    Object.keys(formConfig).forEach((fieldName) => {
      const value = form[fieldName]?.value
      const error = validateField(fieldName, value)

      if (error) {
        errors[fieldName] = error
      } else {
        errors[fieldName] = null
      }
    })

    return errors
  }

  const createInputElement = useCallback(
    (fieldName: string, config: FieldConfig): JSX.Element => {
      let className = form[fieldName].className || config.className || ""
      const defaultValue = form[fieldName]?.defaultValue || config?.defaultValue
      const placeHolder =
        form[fieldName]?.placeHolder || config?.placeHolder || ""
      const fieldValue =
        form[fieldName].value === undefined || form[fieldName].value === null
          ? defaultValue ?? "" // Providing an empty string as fallback
          : form[fieldName].value
      const computedClassName = `${globalClassNames?.[config?.type]} ${
        className || ""
      }`

      let inputProps = {
        name: fieldName,
        onChange: handleChange,
        className: computedClassName,
      }

      switch (config?.type) {
        case "select":
          const options = form[fieldName].options || config.options || []
          const labelKey =
            form[fieldName].labelKey || config?.labelKey || "label"
          const valueKey =
            form[fieldName].valueKey || config?.valueKey || "value"
          const isPlaceholderSelected =
            form[fieldName].value === "" || form[fieldName].value === undefined
          return (
            <select
              {...inputProps}
              defaultValue={
                isPlaceholderSelected ? "" : (form[fieldName].value as string)
              }
            >
              {!!placeHolder && (
                <option value="" disabled>
                  {config.placeHolder ||
                    (form[fieldName].placeHolder as string)}
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
              // defaultChecked={Boolean(defaultValue)}
            />
          )
        case "button":
          return (
            <button className={computedClassName} type="button">
              {config.label}
            </button>
          )
        case "number":
          return (
            <input
              {...inputProps}
              type="number"
              value={fieldValue as number}
              placeholder={config?.placeHolder || (placeHolder as string)}
              minLength={config?.minLength}
              maxLength={config?.maxLength}
              pattern={config?.pattern}
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
              placeholder={config?.placeHolder || (placeHolder as string)}
              minLength={config?.minLength}
              maxLength={config?.maxLength}
              pattern={config?.pattern}
              required={config?.required}
            />
          )
      }
    },
    [form, globalClassNames, handleChange]
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

    const errors = validateForm()

    if (Object.values(errors).some((error) => error !== null)) {
      throw new Error("Form validation errors")
    } else {
      const { submit, reset, ...formValues } = transformedFormValues
      onSubmit(formValues)
    }
  }, [validateForm, onSubmit])

  const handleResetInternal = useCallback(() => {
    setForm((prevForm) => {
      const newForm = { ...prevForm }

      Object.keys(formConfig).forEach((fieldName) => {
        const defaultValue = formConfig[fieldName].defaultValue

        newForm[fieldName] = {
          ...prevForm[fieldName],
          errors: null,
          value: defaultValue,
        }
      })

      return newForm
    })
  }, [formConfig])

  const FormButton = ({
    type = "submit",
    className = "",
    label = "Submit",
    onClick = handleSubmitInternal,
    enabled = true,
  }: {
    forObject?: boolean
    type?: "button" | "submit" | "reset" | undefined
    className?: string
    label?: string
    onClick?: () => void
    enabled?: boolean
  }) => {
    return (
      <button
        className={className || globalClassNames?.button}
        onClick={() => {
          if (enabled) {
            onClick()
          }
        }}
        type={type}
      >
        <p>{label}</p>
      </button>
    )
  }

  const formObject = useMemo(() => {
    const obj: FormObject = {}
    const submitEnabled = Object.values(form).every(
      (field) => field.errors === null
    )

    Object.keys(form).forEach((fieldName) => {
      const fieldType = form[fieldName].type
      const fieldValue = form[fieldName] as string | boolean | OptionType
      let value

      if (
        fieldType === "select" &&
        typeof fieldValue === "object" &&
        fieldValue !== null &&
        "value" in fieldValue
      ) {
        value = fieldValue.value
      } else {
        value = fieldValue
      }

      obj[fieldName] = {
        fieldName,
        inputElement: createInputElement(fieldName, formConfig[fieldName]),
        value: form?.[fieldName].value,
        errors: form?.[fieldName]?.errors,
        placeHolder: form?.[fieldName]?.placeHolder,
        defaultValue: form?.[fieldName]?.defaultValue,
        label: form?.[fieldName]?.label,
        className: form?.[fieldName]?.className,
        type: form?.[fieldName]?.type,
        options: form?.[fieldName]?.options,
      }
    })

    obj["submit"] = {
      fieldName: "submit",
      type: "button",
      inputElement: (
        <FormButton
          type="button"
          label={form["submit"]?.label || "Submit"}
          onClick={handleSubmitInternal}
          enabled={submitEnabled}
          className={`${
            form["submit"]?.className || globalClassNames?.button
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
          className={form["reset"]?.className || globalClassNames?.button}
        />
      ),
    }

    return obj
  }, [
    formConfig,
    createInputElement,
    handleSubmitInternal,
    form,
    globalClassNames,
  ])

  const FormComponent = (
    <form onSubmit={handleSubmitInternal}>
      {Object.keys(formConfig).map((fieldName) => (
        <div key={fieldName}>
          <label htmlFor={fieldName}>{fieldName}</label>
          {createInputElement(fieldName, formConfig[fieldName])}
        </div>
      ))}
      <FormButton
        type="submit"
        label="Submit"
        onClick={handleSubmitInternal}
        className={form["submit"]?.className}
      />
      <FormButton
        type="reset"
        label="Reset"
        onClick={handleResetInternal}
        className={form["submit"]?.className}
      />
    </form>
  )

  return {
    handleSubmitForm: handleSubmitInternal,
    handleChange,
    validateForm,
    formErrors: validateForm(),
    onSubmitForm: onSubmit,
    createInputElement,
    FormComponent,
    formObject,
    // setFormObject: handleUpdateFormItem,
    // setGlobalClassNames: handleUpdateGlobalClassNames,
  }
}

export default useMaakForm
