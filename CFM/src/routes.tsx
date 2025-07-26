import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Error from "./pages/error";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Orders from "./pages/orders/orders";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Account from "./pages/account/account";
import Downloads from "./pages/downloads/downloads";
import Shop from "./pages/shop/shop";
import Lessons from "./pages/lessons/lessons";
import FreeHelp from "./pages/freeHelp/freeHelp";
import SubscribePage from "./pages/subscribe/sucribe";
import CheckoutPage from "./pages/subscribe/checkout";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/account",
        element: <Account />,
        errorElement: <Error />,
      },
      {
        path: "/downloads",
        element: <Downloads />,
        errorElement: <Error />,
      },
      {
        path: "/order-history",
        element: <Orders />,
        errorElement: <Error />,
      },
    ],
  },
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/shop",
    element: <Shop />,
    errorElement: <Error />,
  },
  {
    path: "/lessons",
    element: <Lessons />,
    errorElement: <Error />,
  },
  {
    path: "/free-help",
    element: <FreeHelp />,
    errorElement: <Error />,
  },
  {
    path: "/subscribe",
    element: <SubscribePage />,
    errorElement: <Error />,
  },
  {
    path: "/checkout/digital",
    element: <CheckoutPage />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <Error />,
  },
]);

export default router;