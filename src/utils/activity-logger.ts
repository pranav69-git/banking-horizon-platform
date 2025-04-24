
import { ActivityLog } from "@/contexts/types/auth-types";

export const saveActivityLogs = (userId: string, logs: ActivityLog[]) => {
  const logsToStore = logs.slice(0, 100);
  if (userId) {
    localStorage.setItem(`activityLogs_${userId}`, JSON.stringify(logsToStore));
  } else {
    localStorage.setItem("activityLogs", JSON.stringify(logsToStore));
  }
};

export const loadActivityLogs = (userId: string | undefined): ActivityLog[] => {
  try {
    const key = userId ? `activityLogs_${userId}` : "activityLogs";
    const storedLogs = localStorage.getItem(key);
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (error) {
    console.error("Error loading activity logs:", error);
    return [];
  }
};

export const createActivityLog = (
  action: string,
  details: string,
  userId: string = "guest"
): ActivityLog => ({
  id: Date.now().toString(),
  timestamp: new Date(),
  action,
  details,
  userId
});
