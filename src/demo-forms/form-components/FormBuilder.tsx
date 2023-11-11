import { useEffect, useState } from "react"
import useMaakForm, { FormType, FieldType } from "../../hooks/useMaakForm"

const FormBuilder = () => {
  const [form, setForm] = useState<FormType>({})

  const { formObject, FormComponent } = useMaakForm({
    formConfig: form,
    onSubmit: () => {},
  })

  const addFormElement = () => {
    const newForm = { ...form }
    const newElementKey = "newElementKey" // Define a unique key for the new element
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

  useEffect(() => {
    console.log("formObject", formObject)
    console.log("formcomponent", FormComponent)
  }, [formObject])
  return (
    <div>
      <h1>FormBuilder</h1>
      <button onClick={() => addFormElement()}>add element</button>
      {FormComponent}
    </div>
  )
}

export default FormBuilder
