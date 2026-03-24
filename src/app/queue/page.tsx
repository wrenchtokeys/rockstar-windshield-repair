"use client";

import { useState, useEffect, useCallback } from "react";
import type { Submission, SubmissionStatus } from "@/types/submission";

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; color: string; bg: string }
> = {
  new: { label: "New", color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/30" },
  contacted: { label: "Contacted", color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/30" },
  quoted: { label: "Quoted", color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/30" },
  scheduled: { label: "Scheduled", color: "text-cyan-400", bg: "bg-cyan-500/20 border-cyan-500/30" },
  won: { label: "Won", color: "text-green-400", bg: "bg-green-500/20 border-green-500/30" },
  lost: { label: "Lost", color: "text-zinc-500", bg: "bg-zinc-500/20 border-zinc-500/30" },
};

const STATUS_ORDER: SubmissionStatus[] = [
  "new", "contacted", "quoted", "scheduled", "won", "lost",
];

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function QueuePage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<SubmissionStatus | "all">("all");
  const [loading, setLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const authHeader = useCallback(
    () => ({ "x-queue-auth": password }),
    [password]
  );

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        filter === "all" ? "/api/queue" : `/api/queue?status=${filter}`;
      const res = await fetch(url, { headers: authHeader() });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [filter, authHeader]);

  useEffect(() => {
    if (authed) fetchSubmissions();
  }, [authed, filter, fetchSubmissions]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(fetchSubmissions, 30000);
    return () => clearInterval(interval);
  }, [authed, fetchSubmissions]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/queue", {
      headers: { "x-queue-auth": password },
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      alert("Wrong password");
    }
  };

  const updateStatus = async (id: string, status: SubmissionStatus) => {
    await fetch(`/api/queue/${id}`, {
      method: "PATCH",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchSubmissions();
  };

  const saveNotes = async (id: string) => {
    await fetch(`/api/queue/${id}`, {
      method: "PATCH",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ notes: notesDraft, skipContactedAt: true }),
    });
    setEditingNotes(null);
    fetchSubmissions();
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/queue/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    fetchSubmissions();
  };

  // Login screen
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-8"
        >
          <h1 className="mb-6 text-center text-xl font-bold text-white">
            Queue Dashboard
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold uppercase tracking-widest text-white hover:bg-blue-500"
          >
            Log In
          </button>
        </form>
      </div>
    );
  }

  const newCount = submissions.filter((s) => s.status === "new").length;

  return (
    <div className="min-h-screen bg-zinc-950 pb-24 md:pb-8">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Lead Queue</h1>
            <p className="text-sm text-zinc-400">
              {submissions.length} total
              {newCount > 0 && (
                <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                  {newCount} new
                </span>
              )}
            </p>
          </div>
          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:text-white"
          >
            {loading ? "..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All"
          />
          {STATUS_ORDER.map((s) => (
            <FilterButton
              key={s}
              active={filter === s}
              onClick={() => setFilter(s)}
              label={STATUS_CONFIG[s].label}
              count={submissions.filter((sub) => sub.status === s).length}
            />
          ))}
        </div>
      </div>

      {/* Submissions */}
      <div className="mx-auto max-w-4xl px-4 py-4">
        {submissions.length === 0 && !loading && (
          <p className="py-12 text-center text-zinc-500">
            No submissions yet.
          </p>
        )}

        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className={`rounded-lg border bg-zinc-900 p-4 ${STATUS_CONFIG[sub.status]?.bg || "border-zinc-800"}`}
            >
              {/* Top row: name + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {timeAgo(sub.submittedAt)}
                    {sub.serviceType && ` · ${sub.serviceType}`}
                  </p>
                </div>

                {/* Status dropdown */}
                <select
                  value={sub.status}
                  onChange={(e) =>
                    updateStatus(sub.id, e.target.value as SubmissionStatus)
                  }
                  className={`rounded-md border bg-transparent px-2 py-1 text-xs font-bold ${STATUS_CONFIG[sub.status]?.color || "text-zinc-400"} ${STATUS_CONFIG[sub.status]?.bg || "border-zinc-700"}`}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s} className="bg-zinc-900 text-white">
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details */}
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                {sub.vehicleInfo && (
                  <p className="text-zinc-400">
                    <span className="text-zinc-600">Vehicle:</span>{" "}
                    {sub.vehicleInfo}
                  </p>
                )}
                {sub.damageDescription && (
                  <p className="text-zinc-400">
                    <span className="text-zinc-600">Damage:</span>{" "}
                    {sub.damageDescription}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${sub.phone}`}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500"
                >
                  Call {sub.phone}
                </a>
                <a
                  href={`sms:${sub.phone}`}
                  className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  Text
                </a>
                {sub.email && (
                  <a
                    href={`mailto:${sub.email}`}
                    className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
                  >
                    Email
                  </a>
                )}

                <div className="flex-1" />

                {/* Notes toggle */}
                <button
                  onClick={() => {
                    if (editingNotes === sub.id) {
                      setEditingNotes(null);
                    } else {
                      setEditingNotes(sub.id);
                      setNotesDraft(sub.notes || "");
                    }
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  {sub.notes ? "Edit note" : "+ Note"}
                </button>

                <button
                  onClick={() => deleteSubmission(sub.id)}
                  className="text-xs text-zinc-600 hover:text-red-400"
                >
                  Delete
                </button>
              </div>

              {/* Notes editor */}
              {editingNotes === sub.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveNotes(sub.id);
                    }}
                  />
                  <button
                    onClick={() => saveNotes(sub.id)}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Save
                  </button>
                </div>
              )}

              {/* Show existing notes */}
              {sub.notes && editingNotes !== sub.id && (
                <p className="mt-2 text-xs italic text-zinc-500">
                  Note: {sub.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "border border-zinc-700 text-zinc-400 hover:text-white"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-1 opacity-70">{count}</span>
      )}
    </button>
  );
}
