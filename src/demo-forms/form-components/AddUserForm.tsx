import { useEffect, useState } from "react"
import useMaakForm from "../../hooks/useMaakForm"
import {
  defaultLabelStyles,
  defaultInputStyles,
  checkboxStyling,
} from "../demo-styles/component-styles"
import { add_user_form } from "../form-definitions/add-user-form"
const AddUserForm = () => {
  const { formObject } = useMaakForm({
    formConfig: add_user_form,
    onSubmit: () => {
      console.log("form submitted")
    },
    globalClassNames: {
      select: defaultInputStyles,
      text: defaultInputStyles,
      boolean: checkboxStyling,
    },
    setFormObject: {
      name: {
        defaultValue: "Annyong Bluth",
      },
      email: {
        defaultValue: "annyong.bluth@bluthco.com",
      },
      organization: {
        options: [
          {
            value: "7c1de1ef-14f9-4ccd-a907-31a4ba633240",
            label: "the Bluth Company",
          },
          {
            value: "5673c00f-6510-4690-b4ea-b4ad2a684a85",
            label: "Bluth's Original Frozen Banana Stand",
          },
          {
            value: "86329196-340e-4f47-a412-9267bb57ced1",
            label: "Hot Cops",
          },
          {
            value: "cdd973b9-e987-4850-8e58-31e46521cba1",
            label: "Sudden Valley",
          },
        ],
      },
    },
  })

  const { name, role, email, is_active, organization } = formObject
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 ">
        <label className="font-bold text-sm">Add User Form</label>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor={name.label} className={defaultLabelStyles}>
              {name.label}
            </label>

            {name.errors && (
              <span className="mr-2 text-xs font-semibold text-red-500">
                {name.errors}
              </span>
            )}
          </div>
          <span className="text-maak-black">{name.inputElement}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor={email.label} className={defaultLabelStyles}>
              {email.label}
            </label>

            {email.errors && (
              <span className="mr-2 text-xs font-semibold text-red-500">
                {email.errors}
              </span>
            )}
          </div>
          <span className="text-maak-black w-full">{email.inputElement}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor="" className={defaultLabelStyles}>
              {role.label}
            </label>

            {role.errors && (
              <span className="mr-2 text-xs font-semibold text-red-500">
                {role.errors}
              </span>
            )}
          </div>
          <span className="text-maak-black w-full">{role.inputElement}</span>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex justify-between">
            <label htmlFor={is_active.label} className={defaultLabelStyles}>
              {is_active.label}
            </label>

            {is_active.errors && (
              <span className="mr-2 text-xs font-semibold text-red-500">
                {is_active.errors}
              </span>
            )}
          </div>
          <span className="text-maak-black w-full">
            {is_active.inputElement}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor={organization.label} className={defaultLabelStyles}>
              {organization.label}
            </label>

            {organization.errors && (
              <span className="mr-2 text-xs font-semibold text-red-500">
                {organization.errors}
              </span>
            )}
          </div>
          <span className="text-maak-black w-full">
            {organization.inputElement}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AddUserForm
