import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
