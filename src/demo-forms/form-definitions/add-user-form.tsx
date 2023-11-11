import { FormType } from "../../hooks/useMaakForm"

export const add_user_form: FormType = {
  name: {
    label: "Name",
    type: "text",
    minLength: 1,
    maxLength: 255,
    required: true,
    defaultValue: undefined,
    // placeHolder: "Enter name",
  },
  role: {
    label: "Role",
    type: "select",
    options: [
      { value: "president", label: "President" },
      { value: "mr_manager", label: "Mr. Manager" },
      { value: "inmate", label: "Prisoner #1881372911" },
    ],
    required: true,
    placeHolder: "Select a role",
  },
  email: {
    label: "Email",
    type: "text",
    minLength: 1,
    maxLength: 255,
    required: true,
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    defaultValue: undefined,
    placeHolder: "Enter email",
  },
  is_analyst_and_therapist: {
    label: "Is Analyst and Therapist?",
    type: "boolean",
    required: false,
    className: "",
    defaultValue: false,
  },
  organization: {
    label: "Organization",
    type: "select",
    required: true,
    placeHolder: "Select An Organization",
  },
}
