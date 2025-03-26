
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { File, Plus, ArrowLeft, Upload, Lock } from 'lucide-react';
import Button from '@/components/Button';
import GlassMorphicCard from '@/components/GlassMorphicCard';
import EvidenceCard from '@/components/EvidenceCard';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

// Mock evidence data (in a real app, this would come from an API)
const mockEvidence = [
  {
    id: '1',
    folderId: '1',
    title: 'Case File #1234',
    date: 'June 15, 2023',
    type: 'Document',
    status: 'locked' as const,
  },
  {
    id: '2',
    folderId: '1',
    title: 'Surveillance Footage',
    date: 'June 18, 2023',
    type: 'Video',
    status: 'unlocked' as const,
  },
  {
    id: '3',
    folderId: '1',
    title: 'Interview Transcript',
    date: 'June 20, 2023',
    type: 'Text',
    status: 'locked' as const,
  },
  {
    id: '4',
    folderId: '2',
    title: 'Financial Records',
    date: 'June 22, 2023',
    type: 'Spreadsheet',
    status: 'locked' as const,
  },
];

// Mock folders data
const mockFolders = [
  {
    id: '1',
    title: 'Case #1234',
    date: 'June 15, 2023',
    description: 'Evidence related to case #1234',
  },
  {
    id: '2',
    title: 'Investigation #5678',
    date: 'June 22, 2023',
    description: 'Evidence related to investigation #5678',
  },
];

const EvidenceFolder = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [evidenceList, setEvidenceList] = useState<typeof mockEvidence>([]);
  const [folder, setFolder] = useState<any>(null);
  const [evidenceForm, setEvidenceForm] = useState({
    title: '',
    type: 'Document',
    description: '',
    file: null as File | null,
  });

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (folderId) {
      // In a real app, fetch the evidence for this folder from an API
      const folderEvidence = mockEvidence.filter(item => item.folderId === folderId);
      setEvidenceList(folderEvidence);
      
      // Get folder details
      const folderDetails = mockFolders.find(f => f.id === folderId);
      setFolder(folderDetails);
    }
  }, [folderId]);

  const isManager = user.role === 'manager';
  const isStaff = user.role === 'staff';
  const canAddEvidence = isManager || isStaff;

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvidence = {
      id: Date.now().toString(),
      folderId: folderId || '',
      title: evidenceForm.title,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      type: evidenceForm.type,
      status: 'locked' as const,
    };
    
    setEvidenceList([newEvidence, ...evidenceList]);
    setEvidenceForm({
      title: '',
      type: 'Document',
      description: '',
      file: null,
    });
    setIsAddEvidenceOpen(false);
    toast.success('Evidence added successfully');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceForm({
        ...evidenceForm,
        file: e.target.files[0],
      });
    }
  };

  const handleViewEvidence = (id: string) => {
    toast.info(`Viewing evidence ID: ${id}`);
    // In a real app, this would open the evidence for viewing
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        {folder ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">{folder.title}</h1>
                <p className="text-muted-foreground">
                  Created on {folder.date}
                </p>
              </div>
              
              {canAddEvidence && (
                <Button 
                  onClick={() => setIsAddEvidenceOpen(true)}
                  className="mt-4 md:mt-0 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Evidence</span>
                </Button>
              )}
            </div>

            {folder.description && (
              <GlassMorphicCard className="mb-8 p-6">
                <h3 className="text-sm font-medium mb-2">Folder Description</h3>
                <p className="text-muted-foreground">{folder.description}</p>
              </GlassMorphicCard>
            )}
            
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">Evidence Items</h2>
              
              {evidenceList.length === 0 ? (
                <GlassMorphicCard className="py-16">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-secondary">
                        <File className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No evidence found</h3>
                    <p className="text-muted-foreground mb-4">
                      {canAddEvidence 
                        ? "This folder is empty. Add some evidence to get started."
                        : "There is no evidence available in this folder yet."}
                    </p>
                    {canAddEvidence && (
                      <Button
                        onClick={() => setIsAddEvidenceOpen(true)}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Evidence</span>
                      </Button>
                    )}
                  </div>
                </GlassMorphicCard>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {evidenceList.map((item) => (
                    <EvidenceCard
                      key={item.id}
                      title={item.title}
                      date={item.date}
                      type={item.type}
                      status={item.status}
                      canEdit={isManager}
                      onView={() => handleViewEvidence(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <GlassMorphicCard className="py-16">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-secondary">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Folder not found</h3>
              <p className="text-muted-foreground mb-4">
                The evidence folder you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="mx-auto"
              >
                Return to Dashboard
              </Button>
            </div>
          </GlassMorphicCard>
        )}
      </div>
      
      {/* Add Evidence Dialog */}
      <Dialog open={isAddEvidenceOpen} onOpenChange={setIsAddEvidenceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Evidence</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddEvidence} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                value={evidenceForm.title}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, title: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Evidence Title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="type"
                value={evidenceForm.type}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, type: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="Document">Document</option>
                <option value="Image">Image</option>
                <option value="Video">Video</option>
                <option value="Audio">Audio</option>
                <option value="Text">Text</option>
                <option value="Spreadsheet">Spreadsheet</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={evidenceForm.description}
                onChange={(e) => setEvidenceForm({ ...evidenceForm, description: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-20"
                placeholder="Describe the evidence..."
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="file" className="text-sm font-medium">
                Upload File
              </label>
              <div className="border border-dashed border-input rounded-md p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your file here or
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 cursor-pointer"
                  >
                    Browse files
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  {evidenceForm.file && (
                    <p className="text-sm mt-2">
                      Selected: {evidenceForm.file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEvidenceOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Evidence</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvidenceFolder;
