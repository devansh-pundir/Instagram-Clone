import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Create.css";

const Create = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");

  const nav = useNavigate();

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
        postToDatabase(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postToDatabase = (url) => {
    fetch("http://localhost:5000/createpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        title,
        body,
        photo: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("😄😄 Posted To MongoDB 😄😄", data);
        if (data.Error) {
          console.log(data.Error);
        } else {
          nav("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="wrapper">
        <h1 className="headline">Create Post</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Write here.."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit" onClick={() => postToCloud()}>
            Post
          </button>
        </form>
      </div>
    </>
  );
};

export default Create;
