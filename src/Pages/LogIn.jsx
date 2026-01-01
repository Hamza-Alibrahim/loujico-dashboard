// src/Pages/LogIn.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  // 1. حالات إدارة المدخلات، الأخطاء، وحالة التحميل
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const {
    user: { role },
  } = useContext(AuthContext);

  // 2. دالة التعامل مع عملية تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // التحقق من أن الحقول ليست فارغة
    if (!Email || !Password) {
      setError("Please enter your Email and Password.");
      setLoading(false);
      return;
    }

    try {
      // 3. هنا يتم استدعاء الـ API
      // **هام:** استبدل 'YOUR_API_ENDPOINT/login' بمسار الـ API الحقيقي لتسجيل الدخول.
      const response = await axios.post(
        "http://loujico.somee.com/Api/Account/Login",
        {
          Email,
          Password,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // 4. معالجة بيانات الاستجابة
      // الـ API يجب أن يعيد object يحتوي على token وبيانات المستخدم
      const { data: token } = response.data;
      localStorage.setItem("authToken", token);
      const decoded = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const username =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const employeeId = decoded.EmployeeId;

      console.log(decoded);

      // 5. استخدام دالة الـ login من AuthContext
      // هذه الدالة ستقوم بتخزين بيانات المستخدم والـ token في الـ Context و localStorage
      login({ username, role, employeeId, token });

      // 6. التوجيه إلى لوحة التحكم بعد نجاح تسجيل الدخول
      if (role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/projects");
      }
    } catch (err) {
      // 7. معالجة الأخطاء
      // يمكنك استخدام `err.response?.data?.message` لعرض رسالة خطأ محددة من الـ API
      console.error("API Error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred during login. Please try again."
      );
    } finally {
      // 8. إيقاف حالة التحميل بغض النظر عن النتيجة
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[var(--main-color)] to-[var(--sub-color)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <img
            src="/public/assets/image/logo.png"
            alt="Company Logo"
            className="mx-auto h-24 w-auto mb-4"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {/* 9. عرض رسالة الخطأ إذا كانت موجودة */}
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
              Email address
            </label>
            <input
              className="mt-1 bg-[#E8F0FE]  block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--main-color)] focus:border-[var(--main-color)]"
              id="Email"
              name="Email"
              type="Email"
              autoComplete="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} // تعطيل الحقل أثناء التحميل
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="Password"
            >
              Password
            </label>
            <div className="flex items-center mt-1 w-full px-4 py-2 border bg-[#E8F0FE] border-gray-300 rounded-md shadow-sm focus:ring-[var(--main-color)] focus:border-[var(--main-color)]">
              <input
                className="w-full outline-none"
                id="Password"
                name="Password"
                type={show ? "text" : "Password"}
                autoComplete="current-Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading} // تعطيل الحقل أثناء التحميل
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
                Forgot your Password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--main-color-lighter)] disabled:bg-[var(--main-color-lighter)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-color)] ${
              loading ? "cursor-no-drop" : "cursor-pointer"
            }`}
            disabled={loading} // تعطيل الزر أثناء التحميل لمنع الإرسال المتعدد
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
