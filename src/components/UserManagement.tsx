
import React, { useState } from 'react';
import { User, UserPlus, Mail, Shield, Unlock, Copy } from 'lucide-react';
import Button from './Button';
import GlassMorphicCard from './GlassMorphicCard';
import { toast } from '@/components/ui/sonner';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'user';
  status: 'active' | 'pending';
}

const mockUsers: UserType[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'staff',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'pending',
  },
];

interface UserManagementProps {
  managerId: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ managerId }) => {
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'staff' | 'user',
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call an API to generate secure credentials
    const generatedId = Math.random().toString(36).substring(2, 10);
    const generatedPassword = Math.random().toString(36).substring(2, 10);
    
    const user: UserType = {
      id: generatedId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'pending',
    };
    
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'user' });
    setShowAddUser(false);
    
    toast("User credentials generated", {
      description: `ID: ${generatedId} - Password: ${generatedPassword}`,
      action: {
        label: "Copy",
        onClick: () => {
          navigator.clipboard.writeText(`ID: ${generatedId}, Password: ${generatedPassword}`);
          toast("Copied to clipboard");
        },
      },
    });
  };

  const copyCredentials = (id: string) => {
    // In a real app, this would retrieve the actual credentials
    const mockPassword = "securePwd123";
    
    navigator.clipboard.writeText(
      `Manager Email: manager@securevault.com
User ID: ${id}
Password: ${mockPassword}`
    );
    
    toast("Credentials copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button
          variant="outline"
          onClick={() => setShowAddUser(!showAddUser)}
          className="flex items-center gap-1"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </Button>
      </div>

      {showAddUser && (
        <GlassMorphicCard className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Add New User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full rounded-md border border-input bg-white px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full rounded-md border border-input bg-white px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">User Role</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="staff"
                    checked={newUser.role === 'staff'}
                    onChange={() => setNewUser({ ...newUser, role: 'staff' })}
                    className="h-4 w-4 text-primary border-input"
                  />
                  <span className="text-sm">Staff - Can view and add evidence</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={newUser.role === 'user'}
                    onChange={() => setNewUser({ ...newUser, role: 'user' })}
                    className="h-4 w-4 text-primary border-input"
                  />
                  <span className="text-sm">User - Can only view evidence</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddUser(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Generate Credentials</Button>
            </div>
          </form>
        </GlassMorphicCard>
      )}

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <GlassMorphicCard key={user.id} className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${user.role === 'staff' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {user.role === 'staff' ? (
                    <Shield className="w-5 h-5 text-blue-600" />
                  ) : (
                    <User className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === 'staff' 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role === 'staff' ? 'Staff' : 'User'}
                    </span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      user.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {user.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyCredentials(user.id)}
                className="flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Credentials</span>
              </Button>
            </div>
          </GlassMorphicCard>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
