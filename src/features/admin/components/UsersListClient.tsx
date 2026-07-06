"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShieldCheck,
  Calendar,
  ClipboardList,
  HandCoins,
  X,
  Stethoscope,
  Clock,
  ShieldAlert,
  Ban,
  UserCheck,
  Eye,
  Settings,
  AlertTriangle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CommunityUserProfile } from "@/lib/admin";
import { format, formatDistanceToNow } from "date-fns";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface UsersListClientProps {
  initialUsers: CommunityUserProfile[];
}

export function UsersListClient({ initialUsers }: UsersListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // In-memory simulation of account status adjustments (temporary suspension/ban)
  const [suspendedUserIds, setSuspendedUserIds] = useState<string[]>([]);
  const [bannedUserIds, setBannedUserIds] = useState<string[]>([]);

  // Management Sheet State
  const [selectedUser, setSelectedUser] = useState<CommunityUserProfile | null>(null);
  const [confirmAction, setConfirmAction] = useState<"suspend" | "ban" | "unsuspend" | "reinstate" | null>(null);

  // Helper to determine active status
  function getUserStatus(user: CommunityUserProfile) {
    if (bannedUserIds.includes(user.id)) return "Banned";
    if (suspendedUserIds.includes(user.id)) return "Suspended";
    if (user.role === "admin") return "Admin";
    if (user.role === "vet") {
      return user.is_verified ? "Vet Verified" : "Vet Pending";
    }
    return "Active";
  }

  function getStatusBadgeStyle(status: string) {
    switch (status) {
      case "Admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Vet Verified":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "Vet Pending":
        return "bg-amber-100 text-amber-700 border-amber-200 animate-pulse";
      case "Suspended":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Banned":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  }

  // Filtering Logic
  const filteredUsers = initialUsers.filter((u) => {
    // 1. Text Search matching display name
    if (searchQuery && !u.display_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 2. Role filter
    if (selectedRole !== "all" && u.role !== selectedRole) {
      return false;
    }

    // 3. Status filter
    if (selectedStatus !== "all") {
      const status = getUserStatus(u);
      if (selectedStatus === "Active" && status !== "Active") return false;
      if (selectedStatus === "Suspended" && status !== "Suspended") return false;
      if (selectedStatus === "Banned" && status !== "Banned") return false;
      if (selectedStatus === "Vet Pending" && status !== "Vet Pending") return false;
      if (selectedStatus === "Vet Verified" && status !== "Vet Verified") return false;
    }

    return true;
  });

  const activeFiltersCount =
    (selectedRole !== "all" ? 1 : 0) +
    (selectedStatus !== "all" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  function resetFilters() {
    setSelectedRole("all");
    setSelectedStatus("all");
    setSearchQuery("");
  }

  // Action handlers
  function handleSuspend(userId: string) {
    setSuspendedUserIds((prev) => [...prev, userId]);
    setBannedUserIds((prev) => prev.filter((id) => id !== userId));
    setConfirmAction(null);
  }

  function handleUnsuspend(userId: string) {
    setSuspendedUserIds((prev) => prev.filter((id) => id !== userId));
    setConfirmAction(null);
  }

  function handleBan(userId: string) {
    setBannedUserIds((prev) => [...prev, userId]);
    setSuspendedUserIds((prev) => prev.filter((id) => id !== userId));
    setConfirmAction(null);
  }

  function handleReinstate(userId: string) {
    setSuspendedUserIds((prev) => prev.filter((id) => id !== userId));
    setBannedUserIds((prev) => prev.filter((id) => id !== userId));
    setConfirmAction(null);
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center rounded-[20px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.03)]">
        {/* Text search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#2D3748]/40" />
          <input
            type="text"
            placeholder="Search community users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[10px] border border-[#A788FA]/15 pl-9 pr-8 py-2 text-xs focus:border-[#6C5CE7] focus:outline-none placeholder:text-[#2D3748]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-[#2D3748]/40 hover:text-[#2D3748]"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <CustomSelect
            value={selectedRole}
            onChange={setSelectedRole}
            options={[
              { value: "all", label: "All Roles" },
              { value: "community", label: "Community" },
              { value: "vet", label: "Veterinarian" },
              { value: "admin", label: "Administrator" },
            ]}
            widthClass="w-36"
          />

          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "Active", label: "Active" },
              { value: "Suspended", label: "Suspended" },
              { value: "Banned", label: "Banned" },
              { value: "Vet Pending", label: "Vet Pending" },
              { value: "Vet Verified", label: "Vet Verified" },
            ]}
            widthClass="w-36"
          />

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 rounded-[10px] border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#2D3748]/60 px-1">
        <p>Showing {filteredUsers.length} of {initialUsers.length} users</p>
      </div>

      {/* Grid of Users */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-[20px] border border-[#A788FA]/10 bg-white p-12 text-center text-xs text-[#2D3748]/40">
          No users match your criteria.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((u) => {
            const status = getUserStatus(u);
            return (
              <div
                key={u.id}
                className="flex flex-col justify-between rounded-[18px] border border-[#A788FA]/15 bg-white overflow-hidden shadow-[0_2px_12px_rgba(108,92,231,0.03)] hover:shadow-[0_4px_16px_rgba(108,92,231,0.06)] transition-all"
              >
                {/* Upper Container */}
                <div className="p-4 space-y-4">
                  {/* Header: Name, Avatar, Role & Status Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#6C5CE7]/10 flex items-center justify-center">
                        {u.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.avatar_url}
                            alt={u.display_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-[#6C5CE7]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-[#2D3748] truncate">{u.display_name}</p>
                          {u.is_verified && (
                            <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-[#2D3748]/45 capitalize leading-none">
                          {u.role}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(status)}`}>
                      {status}
                    </span>
                  </div>

                  {/* Joined & Last Active Dates */}
                  <div className="space-y-1 rounded-[10px] bg-[#F7F7FB] p-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#2D3748]/60">
                      <Calendar size={12} className="text-[#A788FA]" />
                      <span>Joined: {format(new Date(u.created_at), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#2D3748]/60">
                      <Clock size={12} className="text-[#A788FA]" />
                      <span>Active: {formatDistanceToNow(new Date(u.lastActive), { addSuffix: true })}</span>
                    </div>
                  </div>

                  {/* Activity Summary Stats */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-[#2D3748]/60">
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                      <span className="flex items-center gap-1">
                        <ClipboardList size={11} className="text-[#6C5CE7]" /> Reports
                      </span>
                      <span className="font-bold text-[#2D3748]">{u.activity.reports}</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                      <span className="flex items-center gap-1">
                        <SparklesIcon size={11} className="text-amber-500" /> Rescues
                      </span>
                      <span className="font-bold text-emerald-600">{u.activity.successfulRescues}</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 col-span-2">
                      <span className="flex items-center gap-1">
                        <HandCoins size={11} className="text-emerald-500" /> Total Donated
                      </span>
                      <span className="font-bold text-emerald-600">฿{u.activity.totalDonated}</span>
                    </div>
                  </div>
                </div>

                {/* Manage Action Footer */}
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setConfirmAction(null);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-[#F7F7FB] border-t border-[#A788FA]/10 text-xs font-semibold text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition w-full"
                >
                  <Settings size={12} /> Manage User
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Moderation Sheet (Slide-over panel) */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => {
        if (!open) {
          setSelectedUser(null);
          setConfirmAction(null);
        }
      }}>
        <SheetContent side="right" className="w-full max-w-md p-6 overflow-y-auto bg-white flex flex-col justify-between">
          {selectedUser && (
            <div className="space-y-6 flex-1">
              <SheetHeader className="border-b border-[#A788FA]/10 pb-4">
                <SheetTitle className="text-sm font-bold text-[#2D3748] flex items-center gap-2">
                  <User size={16} className="text-[#6C5CE7]" />
                  User Management Console
                </SheetTitle>
              </SheetHeader>

              {/* Profile Details */}
              <div className="flex items-center gap-4 p-3 rounded-[16px] border border-[#A788FA]/10 bg-slate-50/50">
                <div className="h-14 w-14 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center text-lg font-bold text-[#6C5CE7] overflow-hidden shrink-0">
                  {selectedUser.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedUser.avatar_url} alt={selectedUser.display_name} className="h-full w-full object-cover" />
                  ) : (
                    selectedUser.display_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-[#2D3748] truncate">{selectedUser.display_name}</h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-[#2D3748]/50 capitalize">{selectedUser.role}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(getUserStatus(selectedUser))}`}>
                      {getUserStatus(selectedUser)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Action-Specific Confirmation Box */}
              {confirmAction ? (
                <div className="rounded-[16px] border border-amber-200 bg-amber-50/50 p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-800">
                        {confirmAction === "suspend" && "Suspend Account?"}
                        {confirmAction === "ban" && "Ban Account?"}
                        {confirmAction === "unsuspend" && "Unsuspend Account?"}
                        {confirmAction === "reinstate" && "Reinstate Account?"}
                      </h4>
                      <p className="text-[10px] text-amber-700 leading-normal mt-1">
                        {confirmAction === "suspend" && `Are you sure you want to suspend "${selectedUser.display_name}"? The user will no longer be able to report, donate, volunteer, foster, or adopt until reactivated.`}
                        {confirmAction === "ban" && `Are you sure you want to ban "${selectedUser.display_name}"? Login access will be disabled and they will be restricted from using platform resources.`}
                        {confirmAction === "unsuspend" && `Are you sure you want to unsuspend "${selectedUser.display_name}"? This will restore full member permissions.`}
                        {confirmAction === "reinstate" && `Are you sure you want to reinstate "${selectedUser.display_name}"? This will remove all flags and bans from the profile.`}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1.5">
                    <button
                      onClick={() => setConfirmAction(null)}
                      className="rounded-[8px] border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-[#2D3748] hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (confirmAction === "suspend") handleSuspend(selectedUser.id);
                        if (confirmAction === "ban") handleBan(selectedUser.id);
                        if (confirmAction === "unsuspend" || confirmAction === "reinstate") handleReinstate(selectedUser.id);
                      }}
                      className="rounded-[8px] bg-amber-600 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-amber-700 transition"
                    >
                      Confirm Action
                    </button>
                  </div>
                </div>
              ) : null}

              {/* View Activity Sections */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-[#2D3748]/50 uppercase tracking-wider">Inspect Records</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/admin/activity?search=${selectedUser.display_name}`}
                    onClick={() => setSelectedUser(null)}
                    className="flex items-center justify-between rounded-[10px] border border-[#A788FA]/15 p-2.5 text-xs text-[#2D3748] hover:bg-slate-50 hover:border-[#6C5CE7]/30 transition"
                  >
                    <span>Activity History</span>
                    <Eye size={12} className="text-[#A788FA]" />
                  </Link>
                  <Link
                    href={`/admin/cases?search=${selectedUser.display_name}`}
                    onClick={() => setSelectedUser(null)}
                    className="flex items-center justify-between rounded-[10px] border border-[#A788FA]/15 p-2.5 text-xs text-[#2D3748] hover:bg-slate-50 hover:border-[#6C5CE7]/30 transition"
                  >
                    <span>Reported Cases</span>
                    <Eye size={12} className="text-[#A788FA]" />
                  </Link>
                  <Link
                    href={`/admin/activity?type=donations&search=${selectedUser.display_name}`}
                    onClick={() => setSelectedUser(null)}
                    className="flex items-center justify-between rounded-[10px] border border-[#A788FA]/15 p-2.5 text-xs text-[#2D3748] hover:bg-slate-50 hover:border-[#6C5CE7]/30 transition"
                  >
                    <span>Donations Log</span>
                    <Eye size={12} className="text-[#A788FA]" />
                  </Link>
                  <Link
                    href={`/admin/activity?search=${selectedUser.display_name}`}
                    onClick={() => setSelectedUser(null)}
                    className="flex items-center justify-between rounded-[10px] border border-[#A788FA]/15 p-2.5 text-xs text-[#2D3748] hover:bg-slate-50 hover:border-[#6C5CE7]/30 transition"
                  >
                    <span>Foster / Adoptions</span>
                    <Eye size={12} className="text-[#A788FA]" />
                  </Link>
                </div>
              </div>

              {/* Moderation Actions panel */}
              <div className="space-y-2 pt-2 border-t border-[#A788FA]/10">
                <h4 className="text-[11px] font-bold text-[#2D3748]/50 uppercase tracking-wider">Account Moderation</h4>
                <div className="space-y-2">
                  {getUserStatus(selectedUser) === "Suspended" ? (
                    <button
                      onClick={() => setConfirmAction("unsuspend")}
                      className="w-full flex items-center justify-center gap-2 rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                    >
                      <UserCheck size={14} /> Unsuspend Account
                    </button>
                  ) : getUserStatus(selectedUser) === "Banned" ? (
                    <button
                      onClick={() => setConfirmAction("reinstate")}
                      className="w-full flex items-center justify-center gap-2 rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                    >
                      <UserCheck size={14} /> Reinstate Account (Lift Ban)
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setConfirmAction("suspend")}
                        className="flex items-center justify-center gap-1.5 rounded-[10px] border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 transition"
                      >
                        <ShieldAlert size={13} /> Suspend Account
                      </button>
                      <button
                        onClick={() => setConfirmAction("ban")}
                        className="flex items-center justify-center gap-1.5 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition"
                      >
                        <Ban size={13} /> Ban Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SparklesIcon(props: { size?: number | string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || "12"}
      height={props.size || "12"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
