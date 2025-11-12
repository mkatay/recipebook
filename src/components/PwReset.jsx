import React from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router';

//import { Toastify } from '../components/Toastify';
import { useEffect } from 'react';
import { MyUserContext } from '../context/MyUserContext';
import { MyToastify } from './MyToastify';

export const PwReset = () => {
  const navigate=useNavigate()
  const {resetPassword,msg,setMsg}=useContext(MyUserContext)

  
  useEffect(()=>{
      setMsg({})
     },[])

  const handleSubmit=async (e)=>{
    e.preventDefault()
    const data = new FormData(e.currentTarget);
    await resetPassword(data.get('email'))
  }

  return (
    <div >
      <div  style={{marginTop: "2rem",width: "100vw",display: "flex",justifyContent: "center"}}>
      <div>
        <h3>Jelszó módosítás</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Add meg az Email címedet:</label>
            <input name="email" placeholder="email" type="email" />
          </div>
          <button>Új jelszó igénylése</button>
        </form>
      </div>
      
    </div>
      {/*msg && <div style={{color:'red',textAlign:'center'}}>{msg?.err}</div>*/}
      {msg && <MyToastify {...msg}/>}
    </div>

  )
}
