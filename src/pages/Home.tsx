import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, UserPlus, Database, Mail, User } from 'lucide-react';
import Button from '@/components/Button';
import GlassMorphicCard from '@/components/GlassMorphicCard';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

const Home = () => {
  const [staffLoginStep, setStaffLoginStep] = useState(1);
  const [userLoginStep, setUserLoginStep] = useState(1);
  const [activeLoginType, setActiveLoginType] = useState<'manager' | 'staff' | 'user' | null>(null);
  const [managerEmail, setManagerEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffLoginStep === 1) {
      // Validate manager email
      if (!managerEmail || !managerEmail.includes('@')) {
        toast.error('Please enter a valid manager email');
        return;
      }
      setStaffLoginStep(2);
    } else {
      // Handle staff login
      if (!userId || !password) {
        toast.error('Please enter your ID and password');
        return;
      }
      toast.success('Login successful');
      navigate('/dashboard');
    }
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userLoginStep === 1) {
      // Validate manager email
      if (!managerEmail || !managerEmail.includes('@')) {
        toast.error('Please enter a valid manager email');
        return;
      }
      setUserLoginStep(2);
    } else {
      // Handle user login
      if (!userId || !password) {
        toast.error('Please enter your ID and password');
        return;
      }
      toast.success('Login successful');
      navigate('/dashboard');
    }
  };

  const renderLoginSection = () => {
    if (activeLoginType === 'staff') {
      return (
        <GlassMorphicCard className="w-full max-w-md mx-auto p-6 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-center">Staff Login</h2>
          <form onSubmit={handleStaffLogin}>
            {staffLoginStep === 1 ? (
              <>
                <div className="mb-4">
                  <label htmlFor="managerEmail" className="block text-sm font-medium mb-1">
                    Manager Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      id="managerEmail"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      className="w-full rounded-md border border-input bg-white px-10 py-2 text-sm"
                      placeholder="manager@example.com"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Continue</Button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="staffId" className="block text-sm font-medium mb-1">
                    Staff ID
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="staffId"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full rounded-md border border-input bg-white px-10 py-2 text-sm"
                      placeholder="Your Staff ID"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-input bg-white px-10 py-2 text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setStaffLoginStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">Login</Button>
                </div>
              </>
            )}
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveLoginType(null)}
              className="text-sm text-primary hover:underline"
            >
              Back to Login Options
            </button>
          </div>
        </GlassMorphicCard>
      );
    } else if (activeLoginType === 'user') {
      return (
        <GlassMorphicCard className="w-full max-w-md mx-auto p-6 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-center">User Login</h2>
          <form onSubmit={handleUserLogin}>
            {userLoginStep === 1 ? (
              <>
                <div className="mb-4">
                  <label htmlFor="managerEmail" className="block text-sm font-medium mb-1">
                    Manager Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      id="managerEmail"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      className="w-full rounded-md border border-input bg-white px-10 py-2 text-sm"
                      placeholder="manager@example.com"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Continue</Button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="userId" className="block text-sm font-medium mb-1">
                    User ID
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="userId"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full rounded-md border border-input bg-white px-10 py-2 text-sm"
                      placeholder="Your User ID"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-input bg-white px-10 py-2 text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setUserLoginStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">Login</Button>
                </div>
              </>
            )}
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveLoginType(null)}
              className="text-sm text-primary hover:underline"
            >
              Back to Login Options
            </button>
          </div>
        </GlassMorphicCard>
      );
    } else if (activeLoginType === 'manager') {
      return (
        <GlassMorphicCard className="w-full max-w-md mx-auto p-6 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-center">Manager Login</h2>
          <div className="flex flex-col gap-4">
            <Link to="/login" className="w-full">
              <Button className="w-full">Login to Manager Account</Button>
            </Link>
            <Link to="/register" className="w-full">
              <Button variant="outline" className="w-full">Create New Manager Account</Button>
            </Link>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveLoginType(null)}
              className="text-sm text-primary hover:underline"
            >
              Back to Login Options
            </button>
          </div>
        </GlassMorphicCard>
      );
    } else {
      return (
        <GlassMorphicCard className="w-full max-w-md mx-auto p-6 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose Login Type</h2>
          <div className="flex flex-col gap-4">
            <Button 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setActiveLoginType('manager')}
            >
              <Shield className="w-5 h-5" />
              <span>Manager</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setActiveLoginType('staff')}
            >
              <Lock className="w-5 h-5" />
              <span>Staff</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setActiveLoginType('user')}
            >
              <User className="w-5 h-5" />
              <span>User</span>
            </Button>
          </div>
        </GlassMorphicCard>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-background/80"></div>
        <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTE4MjcwOCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 animate-fade-in text-balance">
            Secure Evidence Management System
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animation-delay-500 animate-fade-in text-balance">
            Protect, manage, and control access to critical evidence with our 
            tamper-proof blockchain-powered platform.
          </p>
          
          {renderLoginSection()}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassMorphicCard className="animation-delay-500 animate-fade-in">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-green-100 mb-4">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Tamper-Proof Security</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Blockchain technology ensures evidence integrity and prevents unauthorized modifications.
                </p>
              </div>
            </GlassMorphicCard>
            
            <GlassMorphicCard className="animation-delay-1000 animate-fade-in">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-blue-100 mb-4">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Granular control over who can view, add, or modify evidence through secure credentials.
                </p>
              </div>
            </GlassMorphicCard>
            
            <GlassMorphicCard className="animation-delay-1500 animate-fade-in">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-purple-100 mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Storage</h3>
                <p className="text-sm text-center text-muted-foreground">
                  End-to-end encrypted storage keeps your evidence safe from unauthorized access.
                </p>
              </div>
            </GlassMorphicCard>
          </div>
        </div>

        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Complete Evidence Protection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our system provides end-to-end protection for your sensitive information with industry-leading security features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassMorphicCard key={index} className="flex flex-col h-full">
                <div className="p-2 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm flex-grow">{feature.description}</p>
              </GlassMorphicCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to secure your evidence?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join organizations that trust our platform to protect their most sensitive information.
          </p>
          <Link to="/register">
            <Button size="lg">
              Create Your Secure Vault Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="w-6 h-6 text-primary mr-2" />
              <span className="font-bold text-lg">SecureVault</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SecureVault. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Features data
const features = [
  {
    title: "Blockchain Verification",
    description: "Evidence is cryptographically sealed and verified using blockchain technology, making it impossible to alter without detection.",
    icon: <Lock className="w-6 h-6 text-primary" />,
  },
  {
    title: "Secure User Management",
    description: "Managers can create and control staff and user accounts with specific access permissions tailored to organizational needs.",
    icon: <UserPlus className="w-6 h-6 text-primary" />,
  },
  {
    title: "Role-Based Access Control",
    description: "Granular access controls ensure that staff and users can only access evidence relevant to their responsibilities.",
    icon: <Shield className="w-6 h-6 text-primary" />,
  },
  {
    title: "Audit Trails",
    description: "Comprehensive logging of all access and actions for complete accountability and transparency.",
    icon: <Database className="w-6 h-6 text-primary" />,
  },
  {
    title: "Evidence Management",
    description: "Organize and categorize evidence for easy access and management across teams and departments.",
    icon: <Database className="w-6 h-6 text-primary" />,
  },
  {
    title: "Encryption",
    description: "All data is encrypted both in transit and at rest, ensuring maximum protection of sensitive information.",
    icon: <Lock className="w-6 h-6 text-primary" />,
  },
];

export default Home;
