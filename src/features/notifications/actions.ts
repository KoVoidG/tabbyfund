"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth-helpers";

export interface NotificationActionResult {
  success: boolean;
  error?: string;
}

/**
 * Mark a single notification as read using the SECURITY DEFINER RPC.
 * The RPC validates user_id = auth.uid() internally.
 */
export async function markNotificationRead(notificationId: string): Promise<NotificationActionResult> {
  await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.rpc("mark_notification_read", {
    p_notification_id: notificationId,
  });

  if (error) {
    console.error("[notifications] Mark read failed:", error.message);
    return { success: false, error: "Failed to mark notification as read." };
  }

  revalidatePath("/notifications");
  return { success: true };
}

/**
 * Mark all notifications as read for the current user.
 * Uses the mark_notification_read RPC for each unread notification.
 */
export async function markAllNotificationsRead(): Promise<NotificationActionResult> {
  await requireAuth();
  const supabase = await createClient();

  // Get all unread notification IDs for current user
  const { data: unread } = await supabase
    .from("notifications")
    .select("id")
    .eq("is_read", false);

  if (!unread || unread.length === 0) {
    return { success: true };
  }

  // Mark each one using the SECURITY DEFINER function
  for (const n of unread) {
    await supabase.rpc("mark_notification_read", { p_notification_id: n.id });
  }

  revalidatePath("/notifications");
  return { success: true };
}
