import React from "react";
import axios from "axios";
import { useState, Fragment } from "react";
import { Navigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState("");

  const onChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
  };

  const onChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError("");
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "https://miocardial.humicprototyping.com/api/login",
        data
      );
      const { token, role, data: userData } = response.data;

      // Save data to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Save user-specific data based on role
      if (role === "patient") {
        localStorage.setItem("patientId", userData.id);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("gender", userData.gender);
        localStorage.setItem("phone", userData.phone);
        localStorage.setItem("email", userData.email);
      } else if (role === "admin") {
        localStorage.setItem("adminId", userData.id);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("email", userData.email);
      } else if (role === "doctor") {
        localStorage.setItem("doctorId", userData.id);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("specialization", userData.specialization);
        localStorage.setItem("phone", userData.phone);
        localStorage.setItem("email", userData.email);
      }

      setRedirect(true);

      // Redirect based on role
      if (role === "patient") {
        setPage("/dashboardpatient");
      } else if (role === "admin") {
        setPage("/dashboardadmin");
      } else if (role === "doctor") {
        setPage("/dashboarddoctor");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Login Failed");
    }
  };

  return (
    <Fragment>
      {redirect && <Navigate to={page} />}

      <div className="wrapper">
        <form onSubmit={submitLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              value={email}
              onChange={onChangeEmail}
              placeholder="Email"
              required
            />
            <i class="icon fa-solid fa-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              value={password}
              onChange={onChangePassword}
              placeholder="Password"
              required
            />
            <i class="icon fa-solid fa-lock"></i>
          </div>
          <div className="remember">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
          </div>
          {error && <div>{error}</div>}
          <button type="submit">Login</button>

          <div className="register-link">
            <p>
              Dont have an Account? <a href="/register">Register</a>
            </p>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default LoginForm;
