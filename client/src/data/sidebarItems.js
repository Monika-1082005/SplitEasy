import { LayoutDashboard, Split, Hourglass, ListCheck, History, Users, CircleHelp } from "lucide-react";

const sidebarItems = [
  { path: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
  { path: "/create-split", icon: Split, text: "Create a Split", active: true },
  { path: "/pending-payments", icon: Hourglass, text: "Pending Payments" },
  { path: "/settled-payments", icon: ListCheck, text: "Settled Payments" },
  { path: "/history", icon: History, text: "History"},
  { path: "/my-groups", icon: Users, text: "My Groups" },
  { path: "/help", icon: CircleHelp, text: "Help"},
];

export default sidebarItems;
