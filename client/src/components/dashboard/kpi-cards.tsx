import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface KPICardsProps {
  stats?: {
    totalContracts: number;
    activeContracts: number;
    highRiskContracts: number;
    pendingReviews: number;
    complianceScore: number;
  };
  isLoading: boolean;
}

export default function KPICards({ stats, isLoading }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-4" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Unable to load statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const kpiData = [
    {
      title: "Active Contracts",
      value: stats.activeContracts,
      icon: FileText,
      bgColor: "bg-blue-100",
      iconColor: "text-gov-blue",
      change: "+12%",
      changeColor: "text-green-600",
      subtitle: "vs last month",
    },
    {
      title: "High Risk Contracts",
      value: stats.highRiskContracts,
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-gov-red",
      change: "-3",
      changeColor: "text-red-600",
      subtitle: "vs last week",
    },
    {
      title: "Compliance Score",
      value: `${stats.complianceScore}%`,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-gov-green",
      change: "+2.1%",
      changeColor: "text-green-600",
      subtitle: "improvement",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: Clock,
      bgColor: "bg-orange-100",
      iconColor: "text-gov-orange",
      change: null,
      changeColor: "",
      subtitle: "Avg: 3.2 days",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <Card key={index} className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                <kpi.icon className={`${kpi.iconColor} h-6 w-6`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {kpi.change && (
                <span className={`text-sm ${kpi.changeColor} font-medium`}>
                  {kpi.change}
                </span>
              )}
              <span className="text-sm text-gray-500 ml-2">{kpi.subtitle}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
