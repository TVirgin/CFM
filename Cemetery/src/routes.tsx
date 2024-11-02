import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Error from "./pages/login";
import Signup from "./pages/login";
import Home from "./pages/home";
import AddRecord from "./pages/record";

export const router = createBrowserRouter([
    {
        path: "/Home",    
        element: <Home />,
        errorElement: <Error />
    },
    {
        path: "/AddRecord",
        element: <AddRecord />,
        errorElement: <Error />
    },
    {
        path: "/Login",    
        element: <Login />,
        errorElement: <Error />
    },
    {
        path: "/Signup",    
        element: <Signup />,
        errorElement: <Error />
    }
])