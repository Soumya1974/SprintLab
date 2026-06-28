import { useState } from "react";
import Sidebar from "../components/kanbanComponents/Sidebar";
import Topbar from "../components/kanbanComponents/Topbar";
import LogoutModal from "../components/authComponents/LogoutModal";
import Workspaces from "../components/kanbanComponents/Workspaces";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const components = {
    dashboard: <>hello</>,
    workspaces: <Workspaces />
  }

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden font-sans">

      {isOpen && (
        <LogoutModal
          onCancelClick={() => {
            setIsOpen(false);
            setCollapsed(false);
          }}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onLogoutClick={() => {
          setIsOpen(true);
          setCollapsed(true);
        }}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        active={active}
        setActive={setActive}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {
            components[active]
          }
        </main>
      </div>
    </div>
  );
}