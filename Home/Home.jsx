import React, { useContext, useEffect, useState } from "react";

import "./Home.css";

import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [post, setPost] = useState([]);

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:5000/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data.posts);
      });
  }, []);

  // LIKE POST

  const postLike = (id) => {
    fetch("http://localhost:5000/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newPostData = post.map((item) => {
          if (item._id === data._id) {
            return data;
          } else {
            return item;
          }
        });
        setPost(newPostData);
      })
      .catch((err) => console.log(err));
  };

  // UNLIKE POST

  const postUnlike = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newPostData = post.map((item) => {
          if (item._id === data._id) {
            return data;
          } else {
            return item;
          }
        });
        setPost(newPostData);
      })
      .catch((err) => console.log(err));
  };

  // COMMENT ON POST

  const postComment = (text, postId) => {
    fetch("http://localhost:5000/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newPostData = post.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPost(newPostData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // DELETE POST

  const deletePost = (id) => {
    fetch(`http://localhost:5000/deletepost/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("Token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newPostData = post.filter((item) => {
          return item._id !== result._id;
        });
        setPost(newPostData);
      });
  };

  return (
    <>
      <div className="wrapper">
        <div className="home-f-container">
          {post.map((item) => {
            return (
              <>
                {/* Card */}
                <div className="card" key={item._id}>
                  {/* Card Header */}
                  <div className="card-header">
                    <h1 className="user-name">
                      <Link
                        to={
                          item.postedBy._id !== state._id
                            ? "/profile/" + item.postedBy._id
                            : "/profile"
                        }
                      >
                        {item.postedBy.name}
                      </Link>
                    </h1>
                    {item.postedBy._id === state._id && (
                      <button
                        className="del-btn"
                        key={item._id}
                        onClick={() => deletePost(item._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  {/* Card Image */}
                  <img src={item.photo} alt="Post" className="card-img" />
                  <div className="post-info-container">
                    <h1>{item.title}</h1>
                    <h1>{item.body}</h1>
                  </div>
                  {/* Like & Comment */}
                  {item.likes.includes(state._id) ? (
                    <button
                      className="del-btn"
                      onClick={() => {
                        postUnlike(item._id);
                      }}
                    >
                      Unlike
                    </button>
                  ) : (
                    <button
                      className="del-btn"
                      onClick={() => {
                        postLike(item._id);
                      }}
                    >
                      Like
                    </button>
                  )}
                  <div className="like-cmt-container">
                    <p>Like {item.likes.length}</p>
                    <p>Comment</p>
                    <br />
                    {item.comments.map((records) => {
                      return (
                        <>
                          <p>
                            <span style={{ fontWeight: "bolder" }}>
                              {records.postedBy.name}
                            </span>
                            {" : "}
                            {records.text}
                          </p>
                        </>
                      );
                    })}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      postComment(e.target[0].value, item._id);
                    }}
                  >
                    <input type="text" placeholder="Write here.." />
                    <button type="submit">Post</button>
                  </form>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
