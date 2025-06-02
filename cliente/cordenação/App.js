import React from "react"
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import UserList from "./components/userList"
import Edit from "./components/edit"
import Create from "./components/create"

const App = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-fill container my-4">
                <Routes>
                    <Route exact path="/" element={<UserList />} />
                    <Route path="/edit/:id" element={<Edit />} />
                    <Route path="/create" element={<Create />} />
                </Routes>
            </main>
            <Footer /> 
        </div>
    )
}

export default App