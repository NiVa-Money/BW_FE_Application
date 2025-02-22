<<<<<<< HEAD

=======
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes, authProtectedRoutes } from "./routes"; // Import routes configuration
import RouteMiddleware from "./routes/routeMiddleware";
import { ReduxProvider } from "./store/redux-provider";


function App() {
  const router = createBrowserRouter([
    ...publicRoutes.map((route) => ({
      path: route.path,
      element: (
        <RouteMiddleware isProtected={false}>
          {route.component}
        </RouteMiddleware>
      ),
    })),
    ...authProtectedRoutes.map((route) => ({
      path: route.path,
      element: (
        <RouteMiddleware isProtected={true}>
          <ReduxProvider>{route.component}</ReduxProvider>
        </RouteMiddleware>
      ),
    })),

  ]);

  return <><RouterProvider router={router} />
  </>;
}

export default App;