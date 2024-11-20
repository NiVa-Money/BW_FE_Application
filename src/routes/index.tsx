import Login from "../pages/login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
interface RouteType {
  path: string;
  component: any; // Ensures valid component type
  exact?: boolean; // Optional for exact matching
  // Add more properties as needed for protected routes, etc.
}
export const authProtectedRoutes: RouteType[] = [
  { path: "/dashboard", component: <Dashboard /> },
];
export const publicRoutes: RouteType[] = [
  { path: "/login", component: <Login /> },
  { path: "/Signup", component: <SignUp /> },
  { path: "/", component: <Login /> },
];
