import React, { useState, useEffect, useContext } from "react";

import "./UserProfile.css";

import { UserContext } from "../../App";

import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);

  const { state, dispatch } = useContext(UserContext);

  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/user/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserProfile(data);
      })
      .catch((err) => console.log(err));
  }, []);

  // FOLLOW

  const followUser = () => {
    fetch("http://localhost:5000/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "Update",
          payload: {
            following: data.following,
            followers: data.followers,
          },
        });
        localStorage.setItem("User", JSON.stringify(data));
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
      })
      .catch((err) => console.log(err));
  };

  // UNFOLLOW

  const unfollowUser = () => {
    fetch("http://localhost:5000/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        unfollowId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "Update",
          payload: {
            following: data.following,
            followers: data.followers,
          },
        });
        localStorage.setItem("User", JSON.stringify(data));
        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {userProfile ? (
        <>
          <div className="wrapper">
            {/* Top Pane contains Profile Information */}
            <div className="top-pane">
              <img src={userProfile.user.photo} alt="Profile" />
              <h1 className="profile-user-name">{userProfile.user.name}</h1>
              {/* Posts & Follow List */}
              <ul className="stats-container">
                <li>{userProfile.posts.length} posts</li>
                <li>{userProfile.user.followers.length} followers</li>
                <li>{userProfile.user.following.length} following</li>
                <button onClick={() => unfollowUser()}>Unfollow</button>
                <button onClick={() => followUser()}>Follow</button>
              </ul>
            </div>
            {/* Bottom Pane contains Posts */}
            <div className="bottom-pane">
              {userProfile.posts.map((item, index) => {
                return (
                  <>
                    <img src={item.photo} alt="Profile" key={index} />
                  </>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
};

export default UserProfile;
