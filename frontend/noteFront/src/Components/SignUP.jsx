
//signup.jsx

import React, { useState } from 'react';
import axios  from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUP = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [SignupText, setSignupText] = useState('')
    const navigate=useNavigate();
    const [formData,setformData]=useState({
        email:"",
        username:"",
        password:""
    })

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setformData({...formData,[name]:value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post("http://127.0.0.1:8000/register", formData, { withCredentials: true });
          if (res.status === 200) {
            console.log(res.data.message)
            setSignupText(res.data.message);
            setTimeout(() => {
              setSignupText('');
              navigate("/");
            }, 3000);
            setformData({
              email:"",
              username:"",
              password:""
            })
          }
        } catch (error) {
          if (error.response) {
            const { status, data } = error.response;
            if (status === 400 || status === 204) {
              console.log(data.error)
              setErrorMessage(data.error);
      
              setTimeout(() => {
                setErrorMessage('');
              }, 3000);
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
        }
      };
    

  return (
    <div>
         {errorMessage && <h2 style={{textAlign:"center",color:"Red"}}>{errorMessage}</h2>}
         {SignupText && <h2 style={{ textAlign: "center", color: "Green" }}>{SignupText}</h2>}
        <h1>Sign UP</h1>
        <form onSubmit={handleSubmit}>
        <input placeholder='email' type='email' name='email' onChange={handleChange} value={formData.email}></input>
        <input placeholder='username' type='text' name='username' onChange={handleChange} value={formData.username}></input>
        <input placeholder='password' type='password' name='password' onChange={handleChange} value={formData.password}></input>
        <input type="Submit" />
        </form>
    </div>
  )
}

export default SignUP