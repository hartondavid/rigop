import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  BarChart3, 
  FileText, 
  History, 
  CheckCircle, 
  TrendingUp, 
  ClipboardList,
  Upload,
  Download
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    name: "Contract Tracker",
    href: "/contracts",
    icon: FileText,
  },
  {
    name: "Touch Point History",
    href: "/touch-points",
    icon: History,
  },
  {
    name: "Compliance Engine",
    href: "/compliance",
    icon: CheckCircle,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
  },
  {
    name: "Audit Trail",
    href: "/audit-trail",
    icon: ClipboardList,
  },
];

const quickActions = [
  {
    name: "Upload Contract",
    icon: Upload,
    action: () => {
      // TODO: Implement contract upload modal
      console.log("Upload contract");
    },
  },
  {
    name: "Export Report",
    icon: Download,
    action: () => {
      // TODO: Implement report export
      console.log("Export report");
    },
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0 border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gov-blue rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RiGoPA</h1>
            <p className="text-xs text-gray-500">Risk & Governance Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-gov-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-white" : "text-gray-400"
                    )} 
                  />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 px-3">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="mt-3 space-y-1">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={action.action}
                className="w-full text-left text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              >
                <action.icon className="mr-3 h-5 w-5 text-gray-400" />
                {action.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
