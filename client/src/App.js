import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Components/Home/Home';
import SignUp from './Components/SignUp/SignUp';
import Login from './Components/Login/Login';
import { auth } from "./firebase";


function App() {

  const [userName, setUserName] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setUserName(user) : setUserName("")
    })
  });
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Home name={userName} />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
