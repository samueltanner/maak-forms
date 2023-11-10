import { FormType } from "../../hooks/useMaakForms"

export const add_user_form: FormType = {
  name: {
    label: "Name",
    type: "string",
    minLength: 1,
    maxLength: 255,
    required: true,
    defaultValue: undefined,
    placeHolder: "Enter name",
  },
  role: {
    label: "Role",
    type: "select",
    options: [
      { value: "super_admin", label: "Super Admin" },
      { value: "org_admin", label: "Organization Admin" },
      { value: "org_member", label: "Organization Member" },
    ],
    required: true,
    defaultValue: "org_member",
  },
  email: {
    label: "Email",
    type: "string",
    minLength: 1,
    maxLength: 255,
    required: true,
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    defaultValue: undefined,
    placeHolder: "Enter email",
  },
  trial_agreement: {
    label: "Trial Agreement",
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
