import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import { useState,useEffect } from "react";
import Sidebar from "./components/Sidebar";
import HomeNavbar from "./components/HomeNavbar";
import CreateSplit from "./components/CreateSplit";
import sidebarItems from "./data/sidebarItems";
import { SidebarItem } from "./components/Sidebar";
import PendingPayments from "./components/PendingPayments";
import JoinGroup from "./components/JoinGroup";
import PrivateRoute from "./components/PrivateRoute";
import SettledPayments from "./components/SettledPayments";
import './App.css';
import HistorySection from "./components/HistorySection";

const isAuthenticated = () => !!localStorage.getItem("userId");

function App() {
  const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 768;
      setIsMobile(isSmall);
      setIsExpanded(!isSmall);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Signup />}
        />
        <Route path="/join-group" element={<JoinGroup />} />


        {/* Protected Routes (Dashboard & Features) */}
        <Route 
          path="/*" 
          element={
            <PrivateRoute>
            <main className="flex">
              <Sidebar expanded={isExpanded} isMobile={isMobile} onClose={() => setIsExpanded(false)} >
                {sidebarItems.map((item) => (
                  <SidebarItem
                    key={item.path}
                    path={item.path}
                    icon={<item.icon size={20} />}
                    text={item.text}
                    active={item.active}
                    alert={item.alert}
                  />
                ))}
              </Sidebar>

               <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                  isMobile && isExpanded ? "pointer-events-none" : "" /* prevent clicks when sidebar open on mobile */}
                `}
                style={{
                  filter: isMobile && isExpanded ? "opacity(0.3)" : "none", // optional dim background when sidebar open
                }}
              >
                <HomeNavbar 
                  toggleSidebar={() => setIsExpanded((prev) => !prev)}
                  isExpanded={isExpanded} 
                />
                <div className="flex-1 p-4">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-split" element={<CreateSplit />} />
                    <Route path="/pending-payments" element={<PendingPayments />} />
                    <Route path="/settled-payments" element={<SettledPayments />} />
                    <Route path="/history" element={<HistorySection />} />
                  </Routes>
                </div>
              </div>
            </main>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
