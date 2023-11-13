import isEqual from "lodash/isEqual"
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

export type OptionType = { value: string; label: string }
export type FieldType = "text" | "select" | "boolean" | "button" | "number"

interface FieldConfig {
  type?: FieldType
  label?: string
  options?: OptionType[]
  required?: boolean
  defaultValue?: ValueOptions
  placeHolder?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  className?: string
  labelKey?: string
  valueKey?: string
  onClick?: (props?: any) => void
}

export type ValueOptions = string | boolean | undefined | OptionType | number

interface FormErrors {
  [key: string]: string | null
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

export interface FormObject {
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
    pattern?: string
    onClick?: (props?: any) => void
  }
}

const useMaakForm = ({
  key,
  formConfig,
  onSubmit,
  setGlobalClassNames,
  setFormObject = {},
}: FormComponentProps) => {
  const initialFormRef = useRef<FormObject>({})
  const globalClassNames = setGlobalClassNames || {}

  useEffect(() => {
    if (key === "form-builder") console.log("FORM CONFIG", formConfig)
  }, [formConfig])

  useEffect(() => {
    // if (key === "form-builder") console.log("form config UE", formConfig)
    if (Object.keys(formConfig).length === 0) return
    const constructedForm = constructUpdatedForm(setFormObject, formConfig)
    // if (key === "form-builder")
    //   console.log(
    //     "constructedForm",
    //     constructedForm,
    //     "initialFormRef",
    //     initialFormRef.current
    //   )
    initialFormRef.current = constructedForm
  }, [formConfig, setFormObject])

  const [form, setForm] = useState<FormObject>(() => {
    formConfig["submit"] = {
      label: formConfig["submit"]?.label,
      type: "button",
      required: true,
      className: `${globalClassNames?.button} ${
        formConfig["submit"]?.className || ""
      }`,
    }
    formConfig["reset"] = {
      label: formConfig["reset"]?.label,
      type: "button",
      required: true,
      className: `${globalClassNames?.button} ${
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
        options: field.options,
        required: field.required,
        onClick: field.onClick,
        className: field.className,
      }
      return values
    }, {} as FormObject)
  })

  useEffect(() => {
    if (setFormObject && !isEqual(form, setFormObject)) {
      handleUpdateFormItem({ formObjectInput: setFormObject })
    }
  }, [setFormObject])

  function constructUpdatedForm(input: FormObject, prevForm: FormObject) {
    const inputFields = new Set(Object.keys(formConfig))
    const setFormObjectKeys = Object.keys(setFormObject)
    if (setFormObjectKeys.length > 0) {
      setFormObjectKeys.forEach((key) => {
        inputFields.add(key)
      })
    }

    const updatedFormObject = {} as FormObject

    inputFields.forEach((key) => {
      const newItem = input[key]
      const prevItem = prevForm?.[key]

      updatedFormObject[key] = {
        ...prevItem,
        ...newItem,
      }
    })

    return updatedFormObject
  }

  const prevFormRef = useRef<FormObject>({})

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
      enabled = true,
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
          className={
            form?.[fieldName]?.className ||
            className ||
            globalClassNames?.button
          }
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
    [form, formConfig, globalClassNames]
  )

  const createInputElement = useCallback(
    (fieldName: string, config: FieldConfig): JSX.Element => {
      const field = form[fieldName]
      const type = field?.type || config?.type || "text"
      const placeHolder = field?.placeHolder || config?.placeHolder || ""
      const fieldValue = field?.value ?? field?.defaultValue ?? ""
      const className = `${globalClassNames?.[type]} ${form[fieldName]?.className}`
      const label = field?.label || config?.label || ""
      const onClick = field?.onClick || config?.onClick
      const defaultValue = field?.defaultValue || config?.defaultValue

      let inputProps = {
        name: fieldName,
        onChange: handleChange,
        className,
        label,
      }

      switch (type) {
        case "select":
          const options = field?.options || config.options || []
          const labelKey = field?.labelKey || config?.labelKey || "label"
          const valueKey = field?.valueKey || config?.valueKey || "value"
          const selectFieldValue = String(fieldValue)

          return (
            <select {...inputProps} value={selectFieldValue}>
              {!!placeHolder &&
                !options.find((opt) => opt[valueKey] === "") && (
                  <option value="" disabled>
                    {placeHolder as string}
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
              minLength={config?.minLength}
              maxLength={config?.maxLength}
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
              minLength={config?.minLength}
              maxLength={config?.maxLength}
              required={config?.required}
            />
          )
      }
    },
    [form, globalClassNames, handleChange, formConfig]
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
    const originalFormState = initialFormRef.current
    if (Object.keys(originalFormState).length === 0) {
      const error = new Error("initialForm is empty")
      console.log(error)
    } else {
      setForm(originalFormState)
    }
  }, [formConfig])

  const formObject = useMemo(() => {
    const obj: FormObject = {}
    const submitEnabled = Object.values(form).every(
      (field) => field.errors === null
    )

    Object.keys(form).forEach((fieldName) => {
      const field = form[fieldName]
      const fieldType = field.type
      const fieldValue = field as string | boolean | OptionType
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
    if (key === "form-builder") console.log("form object", obj)
    return obj
  }, [
    formConfig,
    createInputElement,
    handleSubmitInternal,
    handleResetInternal,
    form,
    globalClassNames,
  ])

  const FormComponent = useMemo(() => {
    if (key === "form-builder") console.log("rerendering form component")
    return (
      <form onSubmit={handleSubmitInternal} className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-4">
          {Object.keys(form).map((fieldName) => {
            if (key === "form-builder") console.log("fieldName", fieldName)
            const field = form[fieldName]
            const label = field?.label || fieldName
            const formFieldObject = form[fieldName]
            const type = formFieldObject?.type || "text"
            if (!["reset", "submit"].includes(fieldName)) {
              return (
                <div key={fieldName} className="flex flex-col gap-2">
                  {type !== "button" && (
                    <label htmlFor={label} className={globalClassNames?.label}>
                      {label}
                    </label>
                  )}
                  {formFieldObject &&
                    createInputElement(
                      fieldName,
                      formFieldObject as FieldConfig
                    )}
                </div>
              )
            }
          })}
        </div>
        <div className="flex w-full justify-between">
          <FormButton
            type="reset"
            label={form["reset"]?.label || "Reset"}
            onClick={handleResetInternal}
            className={form["submit"]?.className}
            fieldName="reset"
          />
          <FormButton
            type="button"
            label={form["submit"]?.label || "Submit"}
            onClick={handleSubmitInternal}
            className={form["submit"]?.className}
            fieldName="submit"
          />
        </div>
      </form>
    )
  }, [formConfig, form, initialFormRef, createInputElement])

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
    formErrors: validateForm(),
    onSubmitForm: onSubmit,
    createInputElement,
    FormComponent,
    formElements: formObject,
    setFieldValue,
  }
}

export default useMaakForm
