import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import TouchPointsFeed from "@/components/dashboard/touch-points-feed";

export default function TouchPoints() {
  const { data: touchPoints, isLoading } = useQuery({
    queryKey: ["/api/touch-points"],
  });

  return (
    <>
      <Header 
        title="Touch Point History" 
        subtitle="Track all interactions and communications across contracts"
      />
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <TouchPointsFeed 
            touchPoints={(touchPoints as any) || []} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
