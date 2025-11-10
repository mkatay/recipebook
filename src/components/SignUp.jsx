import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { MyUserContext } from "../context/MyUserContext";

export const SignUp = () => {
  const { signUpUser, msg } = useContext(MyUserContext);

  console.log(msg);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    //console.log('Sign Up:', data.get('email'), data.get('password'));
    signUpUser(
      data.get("email"),
      data.get("password"),
      data.get("display_name")
    );
    navigate("/recipes");
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div>
        <h3>Sign UP</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{display:'block'}}>Email</label>
            <input name="email" placeholder="email" type="email" />
          </div>
          <div>
            <label>Password</label>
            <input name="password" placeholder="password " type="password" />
          </div>
          <div>
            <label>Username</label>
            <input name="display_name" placeholder="username " type="text" />
          </div>
          <button>Sign UP</button>
        </form>
        {msg && <div>{msg?.signUp || msg?.err}</div>}
      </div>
    </div>
  );
};
