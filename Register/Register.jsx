import React, { useState } from "react";

import "./Register.css";

import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const nav = useNavigate();

  const handleRegister = (url) => {
    console.log({ name, mail, password, image });

    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        mail,
        password,
        photo: url,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.Error) {
          console.log(data.error);
        } else {
          nav("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  const postToCloud = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dr9717vfy");
    fetch("https://api.cloudinary.com/v1_1/dr9717vfy/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("☁️☁️ Posted To Cloud ☁️☁️", data);
        handleRegister(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="wrapper">
        <h1 className="headline">Register</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit" onClick={() => postToCloud()}>
            Sign up
          </button>
        </form>
        <p className="sub-headline">
          Already have an account? &nbsp;
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </>
  );
};

export default Register;
