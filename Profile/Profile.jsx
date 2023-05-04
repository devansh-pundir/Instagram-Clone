import React, { useState, useEffect, useContext } from "react";

import "./Profile.css";

import { UserContext } from "../../App";

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);

  const [post, setPost] = useState([]);
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data.posts);
      })
      .catch((err) => console.log(err));
  }, []);

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
        setImage(data.url);
        localStorage.setItem(
          "User",
          JSON.stringify({
            ...state,
            photo: data.url,
          })
        );
        dispatch({
          type: "UpdatePhoto",
          payload: data.url,
        });

        fetch("http://localhost:5000/updatepic", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
          body: JSON.stringify({
            photo: data.url,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data))
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="wrapper">
        {/* Top Pane contains Profile Information */}
        <div className="top-pane">
          <img src={state ? state.photo : "User"} alt="Profile" />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit" onClick={() => postToCloud()}>
            Update
          </button>
          <h1 className="profile-user-name">{state ? state.name : "User"}</h1>
          {/* Posts & Follow List */}
          <ul className="stats-container">
            <li>{post.length} posts</li>
            <li>{state ? state.followers.length : 0} followers</li>
            <li>{state ? state.following.length : 0} following</li>
          </ul>
        </div>
        {/* Bottom Pane contains Posts */}
        <div className="bottom-pane">
          {post.map((item, index) => {
            return (
              <>
                <img src={item.photo} alt="Profile" key={index} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Profile;
