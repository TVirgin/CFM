import * as React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { UserAuethProvider } from "./context/userAuthContext";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  return (
    <UserAuethProvider>
      <RouterProvider router={router} />
    </UserAuethProvider>
  );
};

export default App;