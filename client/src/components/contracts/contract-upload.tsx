import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, Check } from "lucide-react";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ContractUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // Basic contract data - in a real app, this would come from a form
      const contractData = {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        vendor: "TBD",
        value: "0",
        currency: "EUR",
        category: "General",
        status: "draft",
      };
      
      formData.append('contractData', JSON.stringify(contractData));
      
      const response = await apiRequest('POST', '/api/contracts', formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Contract uploaded successfully",
        description: "The contract has been uploaded and is ready for processing.",
      });
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, DOC, or DOCX files only.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, DOC, or DOCX files only.",
        variant: "destructive",
      });
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(file.type);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-gov-blue bg-blue-50' 
              : selectedFile 
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gov-blue'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <Check className="h-8 w-8 text-green-600 mx-auto" />
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <Button 
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="bg-gov-blue hover:bg-blue-700"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Contract"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedFile(null)}
                className="ml-2"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <CloudUpload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-gray-600 mb-2">Drop contract files here or</p>
                <Button 
                  variant="ghost" 
                  onClick={handleBrowse}
                  className="text-gov-blue hover:text-blue-700 font-medium"
                >
                  Browse Files
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Supports PDF, DOC, DOCX up to 50MB
                </p>
              </div>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Auto-categorization</span>
            <span className="text-green-600">
              <Check className="h-4 w-4 inline mr-1" />
              Enabled
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Risk assessment</span>
            <span className="text-green-600">
              <Check className="h-4 w-4 inline mr-1" />
              Enabled
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
