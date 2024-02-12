import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import ArDetail from "./pages/ArDetail.tsx";
import ArList from "./pages/ArList.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/ar",
        element: <ArList />,
      },
      {
        path: "/ar/:id",
        element: <ArDetail />,
      },
    ],
  },
]);

export default router;
