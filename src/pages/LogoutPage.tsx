import Cookies from "js-cookie";
import React from "react";

const LogoutPage = () => {

        Cookies.remove("session", { path: "/" });
        window.location.href = "/"; // Redirect to login page or home page


    return (
        <></>
    );
    }

export default LogoutPage;