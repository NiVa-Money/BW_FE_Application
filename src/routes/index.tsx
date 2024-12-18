import Login from "../pages/login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import MyChatBot from "../pages/MyChatBot";
import AdminPanel from "../pages/AdminPanel";
interface RouteType {
  path: string;
  component: any; 
  exact?: boolean; 

}
export const authProtectedRoutes: RouteType[] = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/chatBot", component: <MyChatBot /> },
  { path: "/adminPanel", component: <AdminPanel /> },


];
export const publicRoutes: RouteType[] = [
  { path: "/login", component: <Login /> },
  { path: "/Signup", component: <SignUp /> },
  { path: "/", component: <Login /> },
];
