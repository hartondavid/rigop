import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ComplianceStatus from "@/components/dashboard/compliance-status";

export default function Compliance() {
  const { data: complianceChecks, isLoading } = useQuery({
    queryKey: ["/api/compliance/checks"],
  });

  return (
    <>
      <Header 
        title="Compliance Engine" 
        subtitle="Monitor compliance status and policy adherence"
      />
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <ComplianceStatus 
            checks={(complianceChecks as any) || []} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
