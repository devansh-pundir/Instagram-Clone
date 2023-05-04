import React, { useContext, useEffect, useState } from "react";

import "./Login.css";

import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../../App";

const Login = () => {
  const { state, dispatch } = useContext(UserContext);

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const data = { mail, password };

  const nav = useNavigate();

  const handleLogin = () => {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.Error) {
          console.log(data.error);
        } else {
          localStorage.setItem("Token", data.token);
          localStorage.setItem("User", JSON.stringify(data.user));
          dispatch({
            type: "User",
            payload: data.user,
          });
          nav("/");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const check = localStorage.getItem("User");
    if (check) {
      nav("/");
    }
  });

  return (
    <>
      <div className="wrapper">
        <h1 className="headline">Log In</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" onClick={() => handleLogin()}>
            Log in
          </button>
        </form>
        <p className="sub-headline">
          Create an account &nbsp;
          <Link to="/register">Sign up</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
