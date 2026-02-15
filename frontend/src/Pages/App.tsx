import { Outlet,  } from 'react-router-dom';
import './App.css'
import { Header } from './footer';

function App() {

  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
}

export default App
