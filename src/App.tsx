import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes, authProtectedRoutes } from "./routes";
import RouteMiddleware from "./routes/routeMiddleware";
import { ReduxProvider } from "./store/redux-provider";
import Loader from "./components/Loader";
import { LoaderProvider, useLoader } from "./hooks/loaderContext";

const AppContent = () => {
  const { loading } = useLoader();

  const router = createBrowserRouter([
    ...publicRoutes.map((route) => ({
      path: route.path,
      element: (
        <RouteMiddleware isProtected={false}>{route.component}</RouteMiddleware>
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

  return (
    <>
      <Loader loading={loading} />
      <RouterProvider router={router} />
    </>
  );
};

function App() {
  return (
    <LoaderProvider>
      <AppContent />
    </LoaderProvider>
  );
}

export default App;
