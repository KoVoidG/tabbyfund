import { Users } from "lucide-react";
import { getCommunityUsers } from "@/lib/admin";
import { UsersListClient } from "@/features/admin/components/UsersListClient";
import { getUser } from "@/lib/supabase/auth-helpers";

export const metadata = {
  title: "Community Users — TabbyAdmin",
};

export default async function AdminUsersPage() {
  const user = await getUser();
  const users = await getCommunityUsers(user?.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <Users size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#2D3748]">Community Users</h1>
          <p className="text-xs text-[#2D3748]/60">Platform-wide profiles and volunteer activities</p>
        </div>
      </div>

      {/* Main filters and list */}
      <UsersListClient initialUsers={users} />
    </div>
  );
}
