import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import HealthMateBot from './HealthMateBot'; // ✅ Importing chatbot

const LoginForm = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isRegister) {
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (!nameRegex.test(fullName)) {
      toast.error('Full Name must contain only letters.');
      return;
    }

    if (!phoneRegex.test(phone)) {
      toast.error('Phone Number must contain only numbers.');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please enter and confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!dob) {
      toast.error('Please select your Date of Birth.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullname", fullName);
      formData.append("username", username);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("dob", dob);

      const response = await fetch("http://3.110.213.189:8080/api/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Registered successfully!");
        setIsRegister(false);
      } else {
        const errorText = await response.text();
        toast.error("Registration failed: " + errorText);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong.");
    }
   } else {
    // ✅ LOGIN logic (no change needed here)
    try {
      const response = await fetch("http://3.110.213.189:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const text = await response.text();
        localStorage.setItem('token', text);
        navigate("/dashboard");
      } else if (response.status === 401) {
        toast.error("Username or Password is incorrect.");
      } else {
        toast.error("Server error. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong.");
    }
  }
};


  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url('/bg-login.jpg')` }}
    >
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          {isRegister ? "HealthCare Register Form" : "HealthCare Login Form"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isRegister ? (
            <>
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 mb-4 bg-transparent border-b border-white placeholder-white text-white focus:outline-none" />
              <input type="text" placeholder="User Name" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 mb-4 bg-transparent border-b border-white placeholder-white text-white focus:outline-none" />
              <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 mb-4 bg-transparent border-b border-white placeholder-white text-white focus:outline-none" />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-transparent border-b border-white placeholder-white text-white focus:outline-none" />
              <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 mb-4 bg-transparent border-b border-white placeholder-white text-white focus:outline-none" />
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Enter New Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 bg-transparent border-b border-white placeholder-white text-white focus:outline-none" />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white cursor-pointer text-sm">{showPassword ? "Hide" : "Show"}</span>
              </div>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 mb-4 bg-transparent border-b border-white placeholder-white text-white focus:outline-none" />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-white cursor-pointer text-sm">{showConfirmPassword ? "Hide" : "Show"}</span>
              </div>
            </>
          ) : (
            <>
              <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 mb-4 bg-transparent border-b border-white placeholder-white text-white focus:outline-none" />
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 bg-transparent border-b border-white placeholder-white text-white focus:outline-none" />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white cursor-pointer text-sm">{showPassword ? "Hide" : "Show"}</span>
              </div>
            </>
          )}

          {!isRegister && (
            <div className="flex justify-between items-center text-white text-sm mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="hover:underline">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="w-full bg-black/80 text-white py-3 rounded-full hover:bg-black transition">
            {isRegister ? "Register" : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          {isRegister ? (
            <>Already have an account? <button onClick={() => setIsRegister(false)} className="hover:underline text-white">Login</button></>
          ) : (
            <>Don't have an account? <button onClick={() => setIsRegister(true)} className="hover:underline text-white">Register</button></>
          )}
        </p>
      </div>

      {/* ✅ HealthMate Chatbot Component */}
      <HealthMateBot />

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
    </div>
  );
};

export default LoginForm;
