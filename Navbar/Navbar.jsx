import React, { useContext } from "react";

import "./Navbar.css";

import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../../App";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);

  const nav = useNavigate();

  // const check = localStorage.getItem("User");

  return (
    <>
      <div className="wrapper">
        <nav>
          <div className="brand"></div>
          <div>
            <ul className="nav-links">
              {state ? (
                <>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/createpost">Create Post</Link>
                  </li>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => {
                        localStorage.clear();
                        dispatch({
                          type: "Clear",
                        });
                        nav("/login");
                      }}
                    >
                      Log Out
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/register">Sign Up</Link>
                  </li>
                  <li>
                    <Link to="/login">Sign In</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
