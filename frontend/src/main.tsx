import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'

import App from './Pages/App.tsx'
import { HomePage } from './Pages/selection/countrySelection.tsx';
import { CountryPage } from './Pages/countrypages/countrypages.tsx';
import { Password } from './Pages/mdp/password.tsx';

const router = createBrowserRouter([
  {
    path:'',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Password/>
      },
      {
        path: '/selection',
        element: <HomePage/>
      },
      {
        path: '/CountryPage',
        element: <CountryPage/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router ={router}/>
  </StrictMode>,
)
