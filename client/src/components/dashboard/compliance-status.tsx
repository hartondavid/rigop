import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertTriangle, FileText } from "lucide-react";
import { ComplianceCheck } from "@shared/schema";

interface ComplianceStatusProps {
  checks: ComplianceCheck[];
  isLoading: boolean;
}

export default function ComplianceStatus({ checks, isLoading }: ComplianceStatusProps) {
  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group checks by category and calculate compliance rates
  const complianceByCategory = checks.reduce((acc, check) => {
    const category = (check as any).ruleCategory || 'General';
    if (!acc[category]) {
      acc[category] = { total: 0, compliant: 0 };
    }
    acc[category].total++;
    if (check.status === 'compliant') {
      acc[category].compliant++;
    }
    return acc;
  }, {} as Record<string, { total: number; compliant: number }>);

  const complianceCategories = Object.entries(complianceByCategory).map(([category, data]) => ({
    name: category,
    percentage: data.total > 0 ? Math.round((data.compliant / data.total) * 100) : 100,
    compliant: data.compliant,
    total: data.total,
  }));

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'data protection':
      case 'security':
        return Shield;
      case 'documentation':
        return FileText;
      default:
        return Shield;
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-green-50 border-green-200';
    if (percentage >= 85) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 95) return 'text-gov-green';
    if (percentage >= 85) return 'text-gov-orange';
    return 'text-gov-red';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-gov-green';
    if (percentage >= 85) return 'bg-gov-orange';
    return 'bg-gov-red';
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Compliance Status</CardTitle>
      </CardHeader>
      <CardContent>
        {complianceCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No compliance checks available.
          </div>
        ) : (
          <div className="space-y-4">
            {complianceCategories.map((category) => {
              const Icon = getIcon(category.name);
              return (
                <div 
                  key={category.name} 
                  className={`p-4 rounded-lg border ${getStatusColor(category.percentage)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${getTextColor(category.percentage)}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-500">
                          {category.compliant} of {category.total} checks compliant
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${getTextColor(category.percentage)}`}>
                      {category.percentage}%
                    </span>
                  </div>
                  <Progress 
                    value={category.percentage} 
                    className="h-2"
                    style={{
                      '--progress-background': getProgressColor(category.percentage)
                    } as any}
                  />
                </div>
              );
            })}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="mt-4 text-gov-blue hover:text-blue-700 font-medium w-full"
        >
          View Detailed Report
        </Button>
      </CardContent>
    </Card>
  );
}
