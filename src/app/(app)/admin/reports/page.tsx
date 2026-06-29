import { FileText, CircleCheck, Flag, Copy, Eye } from "lucide-react";

export const metadata = { title: "Reports — TabbyFund Admin" };

const reports = [
  { id: "1", title: "Injured cat near Sukhumvit", reporter: "Somchai K.", status: "new", time: "2 hours ago" },
  { id: "2", title: "Cat with open wound at Chatuchak", reporter: "Nattaya S.", status: "new", time: "5 hours ago" },
  { id: "3", title: "Possible duplicate: Ari eye injury", reporter: "Prawit C.", status: "flagged", time: "1 day ago" },
  { id: "4", title: "Malnourished cat behind temple", reporter: "Kannika W.", status: "approved", time: "3 days ago" },
  { id: "5", title: "Dog bite victim Lumpini", reporter: "Thana P.", status: "approved", time: "2 days ago" },
];

const statusConfig = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  flagged: { label: "Flagged", color: "bg-amber-100 text-amber-700", icon: Flag },
  duplicate: { label: "Duplicate", color: "bg-orange-100 text-orange-700", icon: Copy },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CircleCheck },
};

export default function AdminReportsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <FileText size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-[#2D3748]">Rescue Reports</h1>
          <p className="text-xs text-[#2D3748]/60">{reports.length} total reports</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["All", "New", "Flagged", "Approved"].map((tab) => (
          <button key={tab} className="rounded-full bg-white border border-[#A788FA]/15 px-3.5 py-1.5 text-xs font-medium text-[#2D3748]/60 hover:border-[#6C5CE7]/30 transition first:bg-[#6C5CE7] first:text-white first:border-transparent">
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_4px_20px_rgba(108,92,231,0.08)] divide-y divide-[#A788FA]/5">
        {reports.map((r) => {
          const s = statusConfig[r.status as keyof typeof statusConfig];
          return (
            <div key={r.id} className="flex items-center justify-between px-4 py-3.5 hover:bg-[#F7F7FB] transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7F7FB] shrink-0">
                  <FileText size={14} strokeWidth={1.5} className="text-[#A788FA]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#2D3748] truncate">{r.title}</p>
                  <p className="text-[10px] text-[#2D3748]/50">{r.reporter} · {r.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${s.color}`}>{s.label}</span>
                <button className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#2D3748]/40 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7] transition">
                  <Eye size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
