import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    verificationCode: "",
  });

  const [codeSent, setCodeSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      alert("Please enter your email to send the verification code.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/auth/send-verification", { email: formData.email });
      setCodeSent(true);
      alert("Verification code sent to your email!");
    } catch (err) {
      console.error(err);
      alert("Error sending verification code. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, verificationCode } = formData;

    if (!name || !email || !password || !verificationCode) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/auth/register", formData);
      alert("Registration successful!");
      setFormData({ name: "", email: "", password: "", verificationCode: "" });
      setCodeSent(false);
    } catch (err) {
      console.error(err);
      alert("Error during registration. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          {!codeSent ? (
            <button type="button" onClick={handleSendVerificationCode}>
              Send Verification Code
            </button>
          ) : (
            <>
              <label>Verification Code</label>
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                placeholder="Enter verification code"
                required
              />
            </>
          )}
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
