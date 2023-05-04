import React, { createContext, useContext, useEffect, useReducer } from 'react'


import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'


import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Create from './Components/Create/Create';
import Profile from './Components/Profile/Profile';
import Home from './Components/Home/Home';
// import Private from './Components/Private/Private';
import UserProfile from './Components/User Profile/UserProfile';


import { initialState, reducer } from "./Components/Reducer/Reducer"


export const UserContext = createContext();


const Routing = () => {
  const { state, dispatch } = useContext(UserContext)

  const nav = useNavigate()

  useEffect(() => {
    const User = JSON.parse(localStorage.getItem("User"))
    if (User) {
      dispatch({
        type: "User",
        payload: User
      })
      nav("/")
    } else {
      nav("login")
    }
  }, [])

  return <>
    <Routes>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      {/* <Route element={<Private />}> */}
      <Route path='/' element={<Home />} />
      <Route path='/createpost' element={<Create />} />
      <Route exact path='/profile' element={<Profile />} />
      <Route path='/profile/:id' element={<UserProfile />} />
      {/* </Route> */}
    </Routes>
  </>
}


const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Router>
          <Navbar />
          <Routing />
        </Router>
      </UserContext.Provider>
    </>
  )
}


export default App