import { useEffect, useState } from "react"
import useMaakForm from "../../hooks/useMaakForm"
import {
  defaultLabelStyling,
  defaultInputStyling,
  defaultCheckboxStyling,
  defaultSubmitButtonStyling,
  defaultResetButtonStyling,
} from "../demo-styles/component-styles"
import { add_user_form } from "../form-definitions/add-user-form"
const AddUserForm = () => {
  const { formElements, formErrors } = useMaakForm({
    formConfig: add_user_form,
    onSubmit: () => {
      console.log("form submitted")
    },
    setGlobalClassNames: {
      select: `${defaultInputStyling}  w-80`,
      text: `${defaultInputStyling}  w-80`,
      boolean: `${defaultCheckboxStyling}`,
    },
    setFormObject: {
      name: {
        placeHolder: "Annyong Bluth",
      },
      email: {
        placeHolder: "annyong.bluth@bluthco.com",
      },
      organization: {
        options: [
          {
            value: "7c1de1ef-14f9-4ccd-a907-31a4ba633240",
            label: "The Bluth Company",
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
      submit: {
        className: defaultSubmitButtonStyling,
        label: "Submit",
      },
      reset: {
        className: defaultResetButtonStyling,
        label: "Reset",
      },
    },
  })

  const {
    name,
    role,
    email,
    is_analyst_and_therapist,
    organization,
    submit,
    reset,
    dob_day,
    dob_month,
    dob_year,
  } = formElements
  return (
    <div className="flex flex-col rounded-xl border-2 border-zinc-400 p-8">
      <div className="flex flex-col gap-3 ">
        <label className="text-sm font-bold">Add User Form</label>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor={name.label} className={defaultLabelStyling}>
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
            <label htmlFor={email.label} className={defaultLabelStyling}>
              {email.label}
            </label>

            {email.errors && (
              <span className="mr-2 text-xs font-semibold text-red-500">
                {email.errors}
              </span>
            )}
          </div>
          <span className="w-full text-maak-black">{email.inputElement}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor="" className={defaultLabelStyling}>
              {role.label}
            </label>

            {role.errors && (
              <span className="mr-2 text-xs font-semibold text-red-500">
                {role.errors}
              </span>
            )}
          </div>
          <span className="w-full text-maak-black">{role.inputElement}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex justify-between">
            <label
              htmlFor={is_analyst_and_therapist.label}
              className={`${defaultLabelStyling} whitespace-nowrap pt-0.5`}
            >
              {is_analyst_and_therapist.label}
            </label>

            {is_analyst_and_therapist.errors && (
              <span className="mr-2 text-xs font-semibold text-red-500">
                {is_analyst_and_therapist.errors}
              </span>
            )}
          </div>
          <span className="w-full text-maak-black">
            {is_analyst_and_therapist.inputElement}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor={organization.label} className={defaultLabelStyling}>
              {organization.label}
            </label>

            {organization.errors && (
              <span className="mr-2 text-xs font-semibold text-red-500">
                {organization.errors}
              </span>
            )}
          </div>
          <span className="w-full text-maak-black">
            {organization.inputElement}
          </span>
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        {reset.inputElement} {submit.inputElement}
      </div>
    </div>
  )
}

export default AddUserForm
