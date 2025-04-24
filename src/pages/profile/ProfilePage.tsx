import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useUserContext } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast";

export default function ProfilePage() {
  const { user, profile, logActivity, updateProfile } = useUserContext();

  useEffect(() => {
    logActivity("Profile View", "User viewed their profile page");
  }, [logActivity]);

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      toast({
        variant: "default",
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account preferences
          </p>
        </div>

        {!user?.email_confirmed_at && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-600">Email Verification Pending</AlertTitle>
            <AlertDescription className="text-amber-700">
              Please verify your email address to enjoy all features of Banking Horizon.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProfileForm onSubmit={handleSubmit} />
          </div>
          
          <div>
            <Card className="border-banking-secondary/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-banking-primary">Account Information</CardTitle>
                <CardDescription>Your account details and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="font-medium">Personal Banking</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <p className="font-medium">Active</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">
                    {new Date().toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
