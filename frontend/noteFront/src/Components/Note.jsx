//Note.jsx

import axios from 'axios'
import React, { useEffect,useState } from 'react'
import { useNavigate,Route,Routes,Link } from 'react-router-dom';
import AddNote from './AddNote';
import Logout from './Logout';
import Update from './Update';
import Delete from './Delete';
const Note = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const [notes, setNotes] = useState([]);
  const navigate=useNavigate()

  async function fetchNotes(){

    try {
      const noteData=await axios.get("http://127.0.0.1:8000/note",{withCredentials:true})
      console.log(noteData)
      setNotes(noteData.data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.status === 403) {
        // Handle 401 errors with more specific messages
        const errorMessage = error.response.data; // This should be the descriptive error message
        setErrorMessage(errorMessage);

        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      } else {
        // Handle other errors
        console.error(error);
      }
    }
  }
  useEffect(()=>
    {
      fetchNotes()
    },[]
  )
  const handleUpdate = () => {
    fetchNotes(); // Call fetchNotes to update notes after successful update
  };
 
  return (
    <div  >
       <Logout/>
      {errorMessage && <h2 style={{textAlign:"center",color:"Red"}}>{errorMessage}</h2>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"40px",marginTop:"50px", marginBottom:"30px"}}>
       { notes.map((note)=>(
          <div key={note._id} style={{boxShadow:"1px 1px 1px 1px gray",width:"200px",alignItems:"center"}}>
            <ul><strong>{note.title}</strong></ul>
            <li>{note.description}</li>

            {/* <Update/> */}
            <Update noteId={note._id} onUpdate={handleUpdate} />

            <Delete noteId={note._id} onUpdate={handleUpdate}/>

          </div>
      ))
       }
       </div>
       
       <Link to="/note/add" style={{color:"Green"}}>Want to add Note ?</Link><br/>
       
      

      
       
      
       
    </div>
  )
}

export default Note