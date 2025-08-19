import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function AuditTrail() {
  return (
    <>
      <Header 
        title="Audit Trail" 
        subtitle="Complete audit log and documentation history"
      />
      
      <div className="p-8">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Audit Trail</p>
                <p className="text-xs text-gray-400 mt-2">
                  Detailed audit logs and compliance documentation will be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
