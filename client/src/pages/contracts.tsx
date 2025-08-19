import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ContractList from "@/components/contracts/contract-list";
import ContractUpload from "@/components/contracts/contract-upload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Contracts() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data: contracts, isLoading } = useQuery({
    queryKey: ["/api/contracts"],
  });

  return (
    <>
      <Header 
        title="Contract Tracker" 
        subtitle="Manage and monitor all contracts in your portfolio"
        onNewContract={() => setShowUploadModal(true)}
      />
      
      <div className="p-8">
        <ContractList 
          contracts={(contracts as any) || []} 
          isLoading={isLoading}
          showHeader={true}
        />
      </div>

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload New Contract</DialogTitle>
          </DialogHeader>
          <ContractUpload />
        </DialogContent>
      </Dialog>
    </>
  );
}
