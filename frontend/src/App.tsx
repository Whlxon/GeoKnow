import { useState } from 'react'
import { Outlet,  } from 'react-router-dom';
import { Header } from './Pages/blocs/header';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
}

export default App
