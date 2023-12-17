import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import { Private } from './routes/Private'

const router = createBrowserRouter([
  {
    children:[
        {
            path: "/",
            element:<Private> <Home/> </Private> 
        },
    ]
},
  {
    path: "/login",
    element: <Login/>
  }
])

export {router}
