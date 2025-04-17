
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { logActivity } = useUserContext();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    app: true,
    transactionAlerts: true,
    marketingUpdates: false,
    securityAlerts: true
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    activityTracking: true
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const newValue = !prev[key];
      logActivity("Settings Changed", `${key} notifications set to ${newValue ? 'on' : 'off'}`);
      return { ...prev, [key]: newValue };
    });
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => {
      const newValue = !prev[key];
      logActivity("Privacy Setting Changed", `${key} set to ${newValue ? 'on' : 'off'}`);
      return { ...prev, [key]: newValue };
    });
  };

  const handleResetSettings = () => {
    setNotifications({
      email: true,
      sms: true,
      app: true,
      transactionAlerts: true,
      marketingUpdates: false,
      securityAlerts: true
    });
    setPrivacy({
      dataSharing: false,
      activityTracking: true
    });
    logActivity("Settings Reset", "All settings were reset to default values");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your app settings and preferences</p>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={() => handleNotificationChange('email')}
                      aria-label="Toggle email notifications"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notifications.sms}
                      onCheckedChange={() => handleNotificationChange('sms')}
                      aria-label="Toggle SMS notifications"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-notifications">In-App Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
                    </div>
                    <Switch
                      id="app-notifications"
                      checked={notifications.app}
                      onCheckedChange={() => handleNotificationChange('app')}
                      aria-label="Toggle in-app notifications"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="transaction-alerts">Transaction Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about account transactions</p>
                    </div>
                    <Switch
                      id="transaction-alerts"
                      checked={notifications.transactionAlerts}
                      onCheckedChange={() => handleNotificationChange('transactionAlerts')}
                      aria-label="Toggle transaction alerts"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="security-alerts">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about security events</p>
                    </div>
                    <Switch
                      id="security-alerts"
                      checked={notifications.securityAlerts}
                      onCheckedChange={() => handleNotificationChange('securityAlerts')}
                      aria-label="Toggle security alerts"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-updates">Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about new features and offers</p>
                    </div>
                    <Switch
                      id="marketing-updates"
                      checked={notifications.marketingUpdates}
                      onCheckedChange={() => handleNotificationChange('marketingUpdates')}
                      aria-label="Toggle marketing updates"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">Allow sharing of anonymized data for service improvement</p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={privacy.dataSharing}
                      onCheckedChange={() => handlePrivacyChange('dataSharing')}
                      aria-label="Toggle data sharing"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activity-tracking">Activity Tracking</Label>
                      <p className="text-sm text-muted-foreground">Track your activity for personalized experience</p>
                    </div>
                    <Switch
                      id="activity-tracking"
                      checked={privacy.activityTracking}
                      onCheckedChange={() => handlePrivacyChange('activityTracking')}
                      aria-label="Toggle activity tracking"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      logActivity("Download Data", "User requested to download their data");
                    }}
                  >
                    Download My Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">Appearance settings coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
