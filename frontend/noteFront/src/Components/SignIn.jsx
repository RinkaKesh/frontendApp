
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { response } from 'express';

const SignIn = () => {
  const [loginText, setLoginText] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", formData, { withCredentials: true });
      if (res.status === 200) {
        setLoginText(res.data.message);
        setTimeout(() => {
          setLoginText('');
          navigate("/dashboard");
        },500);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404 || status === 401 || status === 500) {
          setErrorMessage(data.error);
  
          setTimeout(() => {
            setErrorMessage('');
          }, 5000);
        } else {
          console.error(error);
        }
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div style={{ margin: "0 auto", width: "50%" }} >
      {errorMessage && <h2 style={{textAlign:"center",color:"Red"}}>{errorMessage}</h2>}
      {loginText && <h2 style={{ textAlign: "center", color: "Green" }}>{loginText}</h2>}
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Email</label><br />
        <input placeholder='email' type='email' name='email' onChange={handleChange}></input><br />
        <label htmlFor="">Password</label><br />
        <input placeholder='password' type='password' name='password' onChange={handleChange}></input><br />
        <br />
        <input type="Submit" />
      </form>
    </div>
  );
};

export default SignIn;
