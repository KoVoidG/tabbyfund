import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

export interface NotificationRow {
  id: string;
  title: string;
  message: string;
  type: Enums<"notification_type">;
  is_read: boolean;
  created_at: string;
}

/**
 * Get all notifications for the current user, ordered newest first.
 */
export async function getMyNotifications(): Promise<NotificationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, message, type, is_read, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

/**
 * Get unread notification count for the current user.
 */
export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) return 0;
  return count ?? 0;
}
