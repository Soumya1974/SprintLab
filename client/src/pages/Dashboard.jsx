import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LogoutModal from "../components/LogoutModal";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); //f or mobile view
  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden font-sans">
      {
        isOpen && <LogoutModal 
          onCancelClick={() => setIsOpen(false)}
        />
      }
      <Sidebar
        collapsed={collapsed}
        onLogoutClick={() => setIsOpen(true)}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        active={active}
        setActive={setActive}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
      </div>
    </div>
  );
}