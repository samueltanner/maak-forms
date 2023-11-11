import React from "react"
import logo from "./logo.svg"
import "./App.css"
import AddUserForm from "./demo-forms/form-components/AddUserForm"

function App() {
  return (
    <div className="App">
      <header className=""></header>
      <div className="h-screen w-screen bg-maak-black text-white  items-center justify-center flex">
        <AddUserForm />
      </div>
    </div>
  )
}

export default App
