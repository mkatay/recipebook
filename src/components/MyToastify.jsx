import { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { MyUserContext } from '../context/MyUserContext';



export const MyToastify=({err,resetPw,signUp})=> {
  const {setMsg}=useContext(MyUserContext)
    const navigate=useNavigate()
console.log(resetPw);

    useEffect(() => {
        if (err) {
          toast.error(err, { position: "top-left" })
          setMsg({});
        }else if(resetPw){
          toast.success(resetPw, { position: "top-center" });
          // Várakozás a navigáció előtt
          setTimeout(() => {
            navigate('/signin')
            setMsg({});
          }, 2000);
        }else if(signUp){
            toast.success(signUp, { position: "top-center" });
            setMsg({});
        }
       
      }, [err,resetPw,signUp]); 
    
   return (
      <>
        <ToastContainer />
      </>
    );
}