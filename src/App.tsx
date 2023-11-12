import React from "react"
import logo from "./logo.svg"
import "./App.css"
import AddUserForm from "./demo-forms/form-components/AddUserForm"
import FormBuilder from "./demo-forms/form-components/FormBuilder"
// import Menu from "./demo-forms/page-components/Menu"

function App() {
  return (
    <div className="App">
      <header className=""></header>
      <div className="flex h-screen w-screen bg-maak-black text-white">
        {/* <div className="fixed">
          <Menu />
        </div> */}
        <div className="flex h-full w-full items-center justify-center ">
          {/* <AddUserForm /> */}
        </div>
        <div className="flex h-full w-full items-center justify-center ">
          <FormBuilder />
        </div>
      </div>
    </div>
  )
}

export default App
