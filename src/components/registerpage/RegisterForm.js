import React from "react";
import { useState } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";

function RegisterForm() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [error, setError] = useState("");

  const ChangeName = (e) => {
    const value = e.target.value;
    setName(value);
    setError("");
  };
  const ChangeGender = (e) => {
    const selectedGender = e.target.value;
    if (selectedGender === "Man") {
      setGender("male");
    } else if (selectedGender === "Woman") {
      setGender("female");
    }
    setError("");
  };
  const ChangePhone = (e) => {
    const value = e.target.value;
    setPhone(value);
    setError("");
  };
  const ChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
  };
  const ChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError("");
  };

  const klikDaftar = () => {
    const data = {
      name: name,
      gender: gender,
      phone: phone,
      email: email,
      password: password,
    };
    console.log(data);
    axios
      .post("https://miocardial.humicprototyping.com/api/register", data)
      .then((result) => {
        if (result) {
          if (result.data) {
            setName("");
            setGender("");
            setPhone("");
            setEmail("");
            setPassword("");
            setAlert(result.data.message);
            setTimeout(() => {
              setAlert("");
            }, 3000);
          }
        }
      })
      .catch((e) => {
        setError(e.response.data.message);
      });
  };

  return (
    <div className="wrapperregister">
      <form>
        <h1>Registration</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {alert && <Alert variant="success">{alert}</Alert>}
        <div className="input-box">
          <input
            type="text"
            value={name}
            onChange={ChangeName}
            placeholder="Full Name"
            required
          />
          <i class="icon fa-solid fa-font"></i>
        </div>
        <div className="input-box">
          <select
            className="gender-select"
            value={
              gender === "male" ? "Man" : gender === "female" ? "Woman" : ""
            }
            onChange={ChangeGender}
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Man">Man</option>
            <option value="Woman">Woman</option>
          </select>
        </div>
        <div className="input-box">
          <input
            type="text"
            value={phone}
            onChange={ChangePhone}
            placeholder="Phone Number "
            required
          />
          <i class="icon fa-solid fa-phone"></i>
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={ChangeEmail}
            required
          />
          <i class="icon fa-solid fa-user"></i>
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={ChangePassword}
            required
          />
          <i class="icon fa-solid fa-lock"></i>
        </div>

        <button onClick={klikDaftar} type="button">
          Register
        </button>

        <div className="register-link">
          <p>
            Already have an Account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
