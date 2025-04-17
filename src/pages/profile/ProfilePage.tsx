
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Key } from "lucide-react";
import { useUserContext } from "@/contexts/UserContext";

export default function ProfilePage() {
  const { profile, updateProfile, logActivity } = useUserContext();
  const [formData, setFormData] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    updateProfile(formData);
    setIsEditing(false);
    logActivity("Profile Updated", "Personal information was updated");
  };

  const handleViewTab = (tab: string) => {
    logActivity("Viewed", `Viewed profile ${tab} tab`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and security settings</p>
        </div>

        <Tabs defaultValue="personal" className="w-full" onValueChange={handleViewTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button 
                      onClick={() => {
                        setIsEditing(true);
                        logActivity("Started Editing", "Started editing profile information");
                      }}
                      aria-label="Edit profile"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({ ...profile });
                          logActivity("Cancelled Edit", "Cancelled profile edit");
                        }}
                        aria-label="Cancel editing"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveProfile}
                        aria-label="Save profile changes"
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      aria-label="Full name"
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      aria-label="Email address"
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      aria-label="Phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      aria-label="Date of birth"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      aria-label="Address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panCard">PAN Card Number</Label>
                    <Input
                      id="panCard"
                      name="panCard"
                      value={formData.panCard}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      aria-label="PAN card number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline"
                    onClick={() => logActivity("Password Change", "Started password change process")}
                    aria-label="Change password"
                  >
                    Change Password
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => logActivity("2FA", "Started two-factor authentication setup")}
                    aria-label="Set up two-factor authentication"
                  >
                    Set up Two-Factor Authentication
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
                <CardDescription>Upload and manage your KYC documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Your documents are verified and up to date.</p>
                  <Button 
                    variant="outline"
                    onClick={() => logActivity("Document Upload", "Started new document upload")}
                    aria-label="Upload new document"
                  >
                    Upload New Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
