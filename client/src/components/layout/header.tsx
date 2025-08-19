import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onNewContract?: () => void;
}

export default function Header({ title, subtitle, onNewContract }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-4">
          {onNewContract && (
            <Button onClick={onNewContract} className="bg-gov-blue hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
}
