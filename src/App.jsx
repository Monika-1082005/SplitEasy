import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomeNavbar from "./components/HomeNavbar";
import CreateSplit from "./components/CreateSplit";
import sidebarItems from "./data/sidebarItems";
import { SidebarItem } from "./components/Sidebar";
import PendingPayments from "./components/PendingPayments";
import SettledPayments from "./components/SettledPayments";

function App() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Router>
      <main className="flex h-screen">
        <Sidebar expanded={isExpanded}>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={<item.icon size={20} />}
              text={item.text}
              active={item.active}
              alert={item.alert}
            />
          ))}
        </Sidebar>

        <div className="flex-1 flex flex-col transition-all duration-300">
          <HomeNavbar 
            toggleSidebar={() => setIsExpanded((prev) => !prev)}
            isExpanded={isExpanded} 
          />
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/create-split" element={<CreateSplit />} />
              <Route path="/pending-payments" element={<PendingPayments />} />
              <Route path="/settled-payments" element={<SettledPayments />} />
            </Routes>
          </div>
        </div>
      </main>
    </Router>
  );
}

export default App;
