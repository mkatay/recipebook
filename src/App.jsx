import { Route, Routes } from "react-router";
import "./App.css";
import { Home } from "./components/Home";
import { Recipes } from "./components/Recipes";
import { RecipeForm } from "./components/RecipeForm";
import { SignIn } from "./components/SignIn";
import { PwReset } from "./components/PwReset";
import { useContext } from "react";
import { MyUserContext } from "./context/MyUserContext";
import { SignUp } from "./components/SignUp";
import Header from "./components/Header";

function App() {
  const { user } = useContext(MyUserContext);
  return (
    <div className="container">
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/addnew" element={user ? <RecipeForm /> : <SignIn />} />
        <Route path="/edit/:id" element={user ? <RecipeForm /> : <SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pwreset" element={<PwReset />} />
      </Routes>
    </div>
  );
}

export default App;
