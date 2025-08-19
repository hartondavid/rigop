import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, Edit } from "lucide-react";
import { Contract } from "@shared/schema";
import { formatCurrency, formatDate, getRiskLevelColor, getStatusColor } from "@/lib/utils";

interface ContractListProps {
  contracts: Contract[];
  isLoading: boolean;
  showHeader?: boolean;
}

export default function ContractList({ contracts, isLoading, showHeader = false }: ContractListProps) {
  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200">
        {showHeader && (
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Contracts</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Input 
                  placeholder="Search contracts..." 
                  className="pl-10 pr-4 py-2 w-64"
                />
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              </div>
              <Button variant="ghost" className="text-gov-blue hover:text-blue-700">
                View All
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {contracts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No contracts found. Upload your first contract to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id} className="border-b border-gray-200">
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                        <div className="text-sm text-gray-500">{contract.contractNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">{contract.vendor}</TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {formatCurrency(Number(contract.value), contract.currency)}
                    </TableCell>
                    <TableCell>
                      {contract.riskScore && contract.riskLevel ? (
                        <Badge className={getRiskLevelColor(contract.riskLevel)}>
                          {contract.riskLevel} ({contract.riskScore})
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">Not assessed</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {formatDate(contract.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-gov-blue hover:text-blue-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
