
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  File, 
  FolderPlus, 
  Upload, 
  Plus,
  Shield,
  Lock,
  User as UserIcon,
  Folder
} from 'lucide-react';

import Button from '@/components/Button';
import GlassMorphicCard from '@/components/GlassMorphicCard';
import EvidenceCard from '@/components/EvidenceCard';
import UserManagement from '@/components/UserManagement';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

// Mock evidence folders data
const mockEvidenceFolders = [
  {
    id: '1',
    title: 'Case #1234',
    date: 'June 15, 2023',
    itemCount: 3,
  },
  {
    id: '2',
    title: 'Investigation #5678',
    date: 'June 22, 2023',
    itemCount: 2,
  },
];

// Mock evidence data
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [evidenceFolders, setEvidenceFolders] = useState(mockEvidenceFolders);
  const [evidence, setEvidence] = useState(mockEvidence);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderForm, setFolderForm] = useState({
    title: '',
    description: '',
  });
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

  const isManager = user.role === 'manager';
  const isStaff = user.role === 'staff';
  const canAddEvidence = isManager || isStaff;
  const canAddFolder = isManager;

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFolder = {
      id: Date.now().toString(),
      title: folderForm.title,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      itemCount: 0,
    };
    
    setEvidenceFolders([newFolder, ...evidenceFolders]);
    setFolderForm({
      title: '',
      description: '',
    });
    setIsAddFolderOpen(false);
    toast.success('Evidence folder created successfully');
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFolder) {
      toast.error('Please select a folder first');
      return;
    }
    
    const newEvidence = {
      id: Date.now().toString(),
      folderId: selectedFolder,
      title: evidenceForm.title,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      type: evidenceForm.type,
      status: 'locked' as const,
    };
    
    setEvidence([newEvidence, ...evidence]);
    setEvidenceForm({
      title: '',
      type: 'Document',
      description: '',
      file: null,
    });
    setIsAddEvidenceOpen(false);
    
    // Update folder item count
    setEvidenceFolders(prevFolders => 
      prevFolders.map(folder => 
        folder.id === selectedFolder 
          ? { ...folder, itemCount: folder.itemCount + 1 } 
          : folder
      )
    );
    
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

  const handleViewFolder = (folderId: string) => {
    setSelectedFolder(folderId);
    // In a real app, this would navigate to a folder detail page
    navigate(`/evidence/${folderId}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name} ({user.role})
            </p>
          </div>
          
          {canAddFolder && (
            <Button 
              onClick={() => setIsAddFolderOpen(true)}
              className="mt-4 md:mt-0 flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create Evidence Folder</span>
            </Button>
          )}
        </div>

        <GlassMorphicCard className="mb-8 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="p-3 rounded-full bg-primary/10">
                {user.role === 'manager' ? (
                  <Shield className="w-6 h-6 text-primary" />
                ) : user.role === 'staff' ? (
                  <Lock className="w-6 h-6 text-primary" />
                ) : (
                  <UserIcon className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{getRoleTitle(user.role)}</h2>
                <p className="text-sm text-muted-foreground">
                  {getRoleDescription(user.role)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-2xl font-bold">{evidenceFolders.length}</p>
                <p className="text-sm text-muted-foreground">Evidence Folders</p>
              </div>
              
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-2xl font-bold">{evidence.length}</p>
                <p className="text-sm text-muted-foreground">Evidence Items</p>
              </div>
              
              {isManager && (
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
              )}
            </div>
          </div>
        </GlassMorphicCard>

        <Tabs defaultValue="folders" className="animate-fade-in">
          <TabsList className="mb-6">
            <TabsTrigger value="folders">Evidence Folders</TabsTrigger>
            {isManager && <TabsTrigger value="users">User Management</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="folders" className="animate-fade-in">
            {evidenceFolders.length === 0 ? (
              <GlassMorphicCard className="py-16">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-secondary">
                      <Folder className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No evidence folders found</h3>
                  <p className="text-muted-foreground mb-4">
                    {canAddFolder 
                      ? "You haven't created any evidence folders yet. Create one to get started."
                      : "There are no evidence folders available for you to view yet."}
                  </p>
                  {canAddFolder && (
                    <Button
                      onClick={() => setIsAddFolderOpen(true)}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>Create Evidence Folder</span>
                    </Button>
                  )}
                </div>
              </GlassMorphicCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {evidenceFolders.map((folder) => (
                  <GlassMorphicCard 
                    key={folder.id}
                    className="flex flex-col h-full p-6 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewFolder(folder.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{folder.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{folder.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Contains {folder.itemCount} {folder.itemCount === 1 ? 'item' : 'items'}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full"
                    >
                      Open Folder
                    </Button>
                  </GlassMorphicCard>
                ))}
              </div>
            )}
          </TabsContent>
          
          {isManager && (
            <TabsContent value="users" className="animate-fade-in">
              <UserManagement managerId={user.id} />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Add Folder Dialog */}
      <Dialog open={isAddFolderOpen} onOpenChange={setIsAddFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Evidence Folder</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddFolder} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="folder-title" className="text-sm font-medium">
                Folder Title
              </label>
              <input
                id="folder-title"
                value={folderForm.title}
                onChange={(e) => setFolderForm({ ...folderForm, title: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Case #1234"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="folder-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="folder-description"
                value={folderForm.description}
                onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-20"
                placeholder="Describe the evidence folder..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddFolderOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Folder</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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

// Helper functions
function getRoleTitle(role: string): string {
  switch (role) {
    case 'manager':
      return 'Manager Access';
    case 'staff':
      return 'Staff Access';
    case 'user':
      return 'User Access';
    default:
      return 'Limited Access';
  }
}

function getRoleDescription(role: string): string {
  switch (role) {
    case 'manager':
      return 'Full control over evidence and user management';
    case 'staff':
      return 'Can view and add evidence to the system';
    case 'user':
      return 'Limited to viewing permitted evidence';
    default:
      return 'Limited access to system features';
  }
}

export default Dashboard;
