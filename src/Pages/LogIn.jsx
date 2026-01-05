// src/Pages/LogIn.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!Email || !Password) {
      setError(t("login.errors.emptyFields"));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://212.85.25.41:7176/Account/Login",
        {
          Email,
          Password,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { data: token } = response.data;
      const decoded = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const username =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const employeeId = decoded.EmployeeId;

      login({ username, role, employeeId, token });

      if (role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/projects");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || t("login.errors.apiError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[var(--main-color)] to-[var(--sub-color)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <img
            src="/assets/image/logo.png"
            alt="Company Logo"
            className="mx-auto h-24 w-auto mb-4"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t("login.title")}
          </h2>
        </div>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="Email"
            >
              {t("login.emailLabel")}
            </label>
            <input
              className="mt-1 bg-[#E8F0FE]  block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--main-color)] focus:border-[var(--main-color)]"
              id="Email"
              name="Email"
              type="Email"
              autoComplete="Email"
              placeholder={t("login.placeholders.email")}
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="Password"
            >
              {t("login.passwordLabel")}
            </label>
            <div className="flex items-center mt-1 w-full px-4 py-2 border bg-[#E8F0FE] border-gray-300 rounded-md shadow-sm focus:ring-[var(--main-color)] focus:border-[var(--main-color)]">
              <input
                className="w-full outline-none"
                id="Password"
                name="Password"
                type={show ? "text" : "Password"}
                autoComplete="current-Password"
                placeholder={t("login.placeholders.password")}
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {show ? (
                <FaEye
                  onClick={() => setShow(false)}
                  className="cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setShow(true)}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-[var(--main-color)] hover:text-[var(--main-color-lighter)]"
              >
                {t("login.forgotPassword")}
              </a>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--main-color-lighter)] disabled:bg-[var(--main-color-lighter)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-color)] ${
              loading ? "cursor-no-drop" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? t("login.signingIn") : t("login.signIn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
