import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import KPICards from "@/components/dashboard/kpi-cards";
import ContractUpload from "@/components/contracts/contract-upload";
import RiskChart from "@/components/dashboard/risk-chart";
import ContractList from "@/components/contracts/contract-list";
import TouchPointsFeed from "@/components/dashboard/touch-points-feed";
import ComplianceStatus from "@/components/dashboard/compliance-status";
import { useState } from "react";

export default function Dashboard() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: contracts, isLoading: contractsLoading } = useQuery({
    queryKey: ["/api/contracts"],
  });

  const { data: touchPoints, isLoading: touchPointsLoading } = useQuery({
    queryKey: ["/api/touch-points"],
  });

  const { data: complianceChecks, isLoading: complianceLoading } = useQuery({
    queryKey: ["/api/compliance/checks"],
  });

  return (
    <>
      <Header 
        title="Dashboard Overview" 
        subtitle="Monitor contract risks and compliance status"
        onNewContract={() => setShowUploadModal(true)}
      />
      
      <div className="p-8">
        <KPICards stats={stats as any} isLoading={statsLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <ContractUpload />
          </div>
          
          <div className="lg:col-span-2">
            <RiskChart />
          </div>
        </div>

        <ContractList 
          contracts={(contracts as any)?.slice(0, 5) || []} 
          isLoading={contractsLoading}
          showHeader={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <TouchPointsFeed 
            touchPoints={(touchPoints as any)?.slice(0, 5) || []} 
            isLoading={touchPointsLoading}
          />
          
          <ComplianceStatus 
            checks={(complianceChecks as any) || []} 
            isLoading={complianceLoading}
          />
        </div>
      </div>
    </>
  );
}
