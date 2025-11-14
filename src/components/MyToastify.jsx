import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { MyUserContext } from '../context/MyUserContext';

export const MyToastify = () => {
  const { msg, setMsg } = useContext(MyUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!msg) return; // ha nincs üzenet, ne csináljon semmit

    if (msg.err) {
      toast.error(msg.err, { position: "top-left" });
      setMsg(null);

    } else if (msg.resetPw) {
      toast.success(msg.resetPw, { position: "top-center" });
      setTimeout(() => {
        navigate('/signin');
        setMsg(null);
      }, 2000);

    } else if (msg.signUp) {
      toast.success(msg.signUp, { position: "top-center" });
      setMsg(null);

    } else if (msg.serverMsg) {
      toast.success(msg.serverMsg, { position: "top-center" });
      setMsg(null);
    }else if (msg.updateProfile) {
      toast.success(msg.updateProfile, { position: "top-center" });
      setMsg(null);
    }

  }, [msg, navigate, setMsg]);

  return null;
};
