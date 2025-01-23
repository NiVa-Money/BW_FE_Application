import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "../pages/login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import CreateBot from "../pages/CreateBot";
import { AreaChartHero } from "../pages/MyChatBot";
import IntegrationsPage from "../pages/Integration";
import WhatsAppIntegration from "../pages/Integration/IntegrationApp";

const MODULE_MAP = {
    "/dashboard": 1,
    "/chatBot": 2,
    "/adminPanel": 9,
    "/Integration": 5,
    "/IntegrationApp": 5.1,
};

interface RouteType {
    path: string;
    component: React.ReactNode;
    protected?: boolean;
}

const routes: RouteType[] = [
    { path: "/dashboard", component: <Dashboard />, protected: true },
    { path: "/chatBot", component: <AreaChartHero />, protected: true },
    { path: "/adminPanel", component: <AdminPanel />, protected: true },
    { path: "/Integration", component: <IntegrationsPage />, protected: true },
    { path: "/IntegrationApp", component: <WhatsAppIntegration />, protected: true },
    { path: "/login", component: <Login /> },
    { path: "/Signup", component: <SignUp /> },
    { path: "/createbot", component: <CreateBot /> },
    { path: "/", component: <Navigate to="/login" replace /> },
];

const useModuleAccess = () => {
    const moduleMap = React.useMemo(() => {
        const moduleMapString = localStorage.getItem("moduleMap");
        return moduleMapString ? JSON.parse(moduleMapString) : [];
    }, []);

    const checkAccess = (path: string): boolean => {
        const requiredModule = MODULE_MAP[path as keyof typeof MODULE_MAP];
        return moduleMap.includes(requiredModule);
    };

    return { checkAccess };
};

const ProtectedRoute: React.FC<{ route: RouteType }> = ({ route }) => {
    const { checkAccess } = useModuleAccess();

    if (!checkAccess(route.path)) {
        return <Navigate to="/login" replace />;
    }

    return <>{route.component}</>;
};

const RouteMiddleware: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    if (!localStorage.getItem("user_id")) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {routes.map((route) =>
                    route.protected ? (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <RouteMiddleware>
                                    <ProtectedRoute route={route} />
                                </RouteMiddleware>
                            }
                        />
                    ) : (
                        <Route key={route.path} path={route.path} element={route.component} />
                    )
                )}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
