import React, { useContext } from "react";

// import { GoogleLogin } from "@react-oauth/google";
// import { googleLogout } from "@react-oauth/google";
import "../../styles/navbar.css";
import { useState } from "react";
import { AuthContext } from "../../App";
import apiService from "../../services/api-service";
import { ReactComponent as Logo } from "../../img/SkyBlog-Logo.svg";

export default function Navbar() {
    const { state, dispatch } = useContext(AuthContext);
    const [isNavExpanded, setIsNavExpanded] = useState(false);

    console.log("State");
    console.log(state);
    return (
        <nav className="navigation">
            <a href="/" className="brand-name">
                {/* SkyBlog */}
                <Logo />
            </a>
            <button
                className="hamburger"
                onClick={() => {
                    setIsNavExpanded(!isNavExpanded);
                }}
            >
                {/* icon from heroicons.com */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="white"
                >
                    <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            <div
                className={
                    isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
                }
            >
                <ul>
                    <li>
                        <a href="/home">Home</a>
                    </li>
                    <li>
                        <a href="/checklogin">CheckLogin</a>
                    </li>
                    <li>
                        <a href="/blogs">Blogs</a>
                    </li>
                    <li>
                        <a href="/Categories">Categories</a>
                    </li>
                    <li>
                        <a href="/series">Series</a>
                    </li>
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                    {state.isLoggedIn ? (
                        state.user.role == "admin" ? (
                            <li>
                                <a href="/admin">Admin</a>
                            </li>
                        ) : null
                    ) : null}
                    <li>
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-nav-input"
                            onKeyDown={(e) => {
                                // Enter key
                                if (e.key === "Enter") {
                                    window.location.href =
                                        "/search/?searchString=" +
                                        e.currentTarget.value;
                                }
                            }}
                        />
                    </li>
                    {state.isLoggedIn ? (
                        <li
                            style={{
                                marginLeft: "auto",
                            }}
                        >
                            <div className="loggedInUserMenu">
                                <div className="loggedInUserMenu-Button">
                                    {state.user.picture ? (
                                        <img
                                            className="profile-pic"
                                            src={state.user.picture}
                                            alt="User Picture"
                                        />
                                    ) : (
                                        <img
                                            className="profile-pic"
                                            src={require("../../img/default-profile-pic.png")}
                                            alt="User Picture"
                                        />
                                    )}
                                </div>
                                <div className="loggedInUser-dropdown-content">
                                    <a href={"/users/" + state.user.username}>
                                        {state.user.username}
                                    </a>
                                    <a
                                        href="#"
                                        onClick={() => {
                                            apiService("logout").then((res: any) => {
                                                if (res.data.success) {
                                                    console.log("Logged out");
                                                    if (state.user.provider == "Google") {
                                                        // googleLogout();
                                                    }
                                                    dispatch({
                                                        type: "LOGOUT",
                                                    });

                                                    window.location.reload();
                                                }
                                            });
                                        }}
                                    >
                                        Logout
                                    </a>
                                </div>
                            </div>
                        </li>
                    ) : (
                        <div className="navbar-right">
                            <li>
                                <a href="/login">Login</a>
                            </li>
                            <li>
                                <a href="/register">Register</a>
                            </li>
                        </div>
                    )}
                </ul>
            </div>
        </nav>
    );
}
