import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, CheckCircle, AlertTriangle, Users, FileText, Calendar } from "lucide-react";
import { TouchPoint } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface TouchPointsFeedProps {
  touchPoints: TouchPoint[];
  isLoading: boolean;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'email':
      return Mail;
    case 'milestone':
      return CheckCircle;
    case 'alert':
      return AlertTriangle;
    case 'meeting':
      return Users;
    case 'document_update':
      return FileText;
    case 'review':
      return Calendar;
    default:
      return FileText;
  }
};

const getColorForType = (type: string) => {
  switch (type) {
    case 'email':
      return 'bg-blue-100 text-gov-blue';
    case 'milestone':
      return 'bg-green-100 text-gov-green';
    case 'alert':
      return 'bg-orange-100 text-gov-orange';
    case 'meeting':
      return 'bg-purple-100 text-purple-600';
    case 'document_update':
      return 'bg-gray-100 text-gray-600';
    case 'review':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function TouchPointsFeed({ touchPoints, isLoading }: TouchPointsFeedProps) {
  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Touch Points</CardTitle>
      </CardHeader>
      <CardContent>
        {touchPoints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent touch points found.
          </div>
        ) : (
          <div className="space-y-4">
            {touchPoints.map((touchPoint) => {
              const Icon = getIconForType(touchPoint.type);
              const colorClass = getColorForType(touchPoint.type);
              
              return (
                <div key={touchPoint.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{touchPoint.title}</p>
                    {touchPoint.description && (
                      <p className="text-sm text-gray-500">{touchPoint.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(touchPoint.createdAt), { addSuffix: true })}
                      {touchPoint.source && ` • ${touchPoint.source}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="mt-4 text-gov-blue hover:text-blue-700 font-medium w-full"
        >
          View All Touch Points
        </Button>
      </CardContent>
    </Card>
  );
}
