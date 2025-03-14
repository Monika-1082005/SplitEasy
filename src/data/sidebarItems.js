import { LayoutDashboard, Split, Hourglass, ListCheck, History, Settings, CircleHelp } from "lucide-react";

const sidebarItems = [
  { path: "/", icon: LayoutDashboard, text: "Dashboard" },
  { path: "/create-split", icon: Split, text: "Create a Split", active: true },
  { path: "/pending-payments", icon: Hourglass, text: "Pending Payments" },
  { path: "/settled-payments", icon: ListCheck, text: "Settled Payments" },
  { path: "/history", icon: History, text: "History", alert: true },
  { path: "/settings", icon: Settings, text: "Settings" },
  { path: "/help", icon: CircleHelp, text: "Help" },
];

export default sidebarItems;
