
import { Route, Routes } from 'react-router'
import './App.css'
import { Home } from './components/Home'
import { Recipes } from './components/Recipes'
import { RecipeForm } from './components/RecipeForm'


function App() {
 
   return (
   <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/addnew" element={<RecipeForm />} />
    </Routes>
  )
}

export default App
