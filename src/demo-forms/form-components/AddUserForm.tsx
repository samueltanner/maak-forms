import useMaakForms from "../../hooks/useMaakForms"
import { add_user_form } from "../form-definitions/add-user-form"
const AddUserForm = () => {
  const { formObject } = useMaakForms({
    formConfig: add_user_form,
    onSubmit: () => {
      console.log("form submitted")
    },
  })
  const { name, role, email, trial_agreement, organization } = formObject
  return (
    <div>
      <label>Add User Form</label>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label htmlFor="">{name?.label}</label>

          {name?.errors && (
            <span className="mr-2 text-xs font-semibold text-red-500">
              {name?.errors}
            </span>
          )}
        </div>
        {name.inputElement}
      </div>
      <div>
        <label htmlFor="">{role?.label} hi there sammy</label>
        {role.inputElement}
      </div>
    </div>
  )
}

export default AddUserForm
