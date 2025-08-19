import Header from "@/components/layout/header";
import RiskChart from "@/components/dashboard/risk-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <>
      <Header 
        title="Analytics & Reporting" 
        subtitle="Advanced analytics and insights for contract performance"
      />
      
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RiskChart />
          
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Performance Analytics</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Advanced metrics and KPIs will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
