"use client";

import { useState, useEffect, useCallback } from "react";
import type { Submission, SubmissionStatus } from "@/types/submission";
import { BUSINESS } from "@/lib/constants";

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

// Review-request texts open in the owner's own Messages app prefilled
// (sms: deep link) rather than sending through an SMS API — a text from
// the number the customer already knows converts far better than one from
// an unregistered toll-free number, and it needs no carrier registration.
const REVIEW_URL = BUSINESS.googleReviewUrl;

// Strip formatting before it goes in a tel:/sms: URI — some dialers choke
// on spaces and parens in numbers typed the way people write them.
function phoneDigits(phone: string): string {
  return phone.replace(/[^+\d]/g, "");
}

function reviewSmsHref(sub: Submission, followup: boolean): string {
  const first = sub.name.trim().split(/\s+/)[0];
  const body = followup
    ? `No pressure at all${first ? `, ${first}` : ""} — but if you get a minute, that review link is still live: ${REVIEW_URL} Either way, thanks again! — Drake, Rockstar Windshield Repair`
    : `Thanks for choosing Rockstar Windshield Repair${first ? `, ${first}` : ""}! If you have a minute, a quick Google review helps a one-man shop more than you know: ${REVIEW_URL} — Drake`;
  // "?&body=" is the one separator both iOS and Android accept.
  return `sms:${phoneDigits(sub.phone)}?&body=${encodeURIComponent(body)}`;
}

const EMPTY_LEAD = {
  name: "",
  phone: "",
  email: "",
  vehicleInfo: "",
  notes: "",
  status: "new" as SubmissionStatus,
};

function olderThan24h(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() > 24 * 60 * 60 * 1000;
}

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
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState(EMPTY_LEAD);
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);
  const [actionError, setActionError] = useState("");

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
      if (!res.ok) {
        setActionError(
          `Couldn't load leads (server error ${res.status}). Filtering by status needs DynamoDB Query permission on the status-submitted-index.`
        );
        return;
      }
      const data = await res.json();
      setActionError("");
      setSubmissions(data.submissions || []);
    } catch {
      setActionError("Couldn't reach the server.");
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

  // Every write goes through here so a failure is visible instead of the
  // card silently snapping back to its old value.
  const patchLead = async (
    id: string,
    body: Record<string, unknown>,
    what: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/queue/${id}`, {
        method: "PATCH",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setActionError(
          `Couldn't ${what} (server error ${res.status}). Writes need DynamoDB UpdateItem permission on the leads table.`
        );
        return false;
      }
      setActionError("");
      return true;
    } catch {
      setActionError(`Couldn't ${what} — no response from the server.`);
      return false;
    }
  };

  const markReviewAsked = async (id: string, followup: boolean) => {
    await patchLead(
      id,
      followup ? { markReviewFollowup: true } : { markReviewRequested: true },
      "record the review request"
    );
    fetchSubmissions();
  };

  const updateStatus = async (sub: Submission, status: SubmissionStatus) => {
    const ok = await patchLead(sub.id, { status }, "change the status");
    if (!ok) {
      fetchSubmissions();
      return;
    }
    // Marking a job Won opens Messages prefilled with the review request —
    // one tap to send while the customer is still happy.
    if (status === "won" && !sub.reviewRequestedAt && sub.phone && REVIEW_URL) {
      await markReviewAsked(sub.id, false);
      window.location.href = reviewSmsHref(sub, false);
      return;
    }
    fetchSubmissions();
  };

  const createLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAdding(true);
    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || "Failed to add lead");
        return;
      }

      const created: Submission = data.submission;
      setNewLead(EMPTY_LEAD);
      setShowAddLead(false);

      // Adding a job straight in as Won is the parking-lot case: the repair
      // is done and the customer is standing right there. Open the review
      // text immediately, same as flipping the status dropdown to Won.
      if (created.status === "won" && created.phone && REVIEW_URL) {
        await markReviewAsked(created.id, false);
        window.location.href = reviewSmsHref(created, false);
        return;
      }

      // Don't let an active filter hide the lead that was just added.
      if (filter !== "all" && filter !== created.status) {
        setFilter("all");
      } else {
        fetchSubmissions();
      }
    } catch {
      setAddError("Failed to add lead");
    } finally {
      setAdding(false);
    }
  };

  const saveNotes = async (id: string) => {
    const ok = await patchLead(
      id,
      { notes: notesDraft, skipContactedAt: true },
      "save the note"
    );
    if (ok) setEditingNotes(null);
    fetchSubmissions();
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    try {
      const res = await fetch(`/api/queue/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      if (!res.ok) {
        setActionError(
          `Couldn't delete (server error ${res.status}). Deleting needs DynamoDB DeleteItem permission on the leads table.`
        );
      } else {
        setActionError("");
      }
    } catch {
      setActionError("Couldn't delete — no response from the server.");
    }
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAddError("");
                setShowAddLead((v) => !v);
              }}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-blue-500"
            >
              {showAddLead ? "Cancel" : "+ Add Lead"}
            </button>
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:text-white"
            >
              {loading ? "..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="border-b border-red-900 bg-red-950/60 px-4 py-3">
          <div className="mx-auto flex max-w-4xl items-start justify-between gap-3">
            <p className="text-sm text-red-300">{actionError}</p>
            <button
              onClick={() => setActionError("")}
              className="shrink-0 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Add a lead that never came through the contact form — phone calls,
          referrals, walk-ups. Same pipeline, so they get the review SMS too. */}
      {showAddLead && (
        <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-4">
          <form onSubmit={createLead} className="mx-auto max-w-4xl">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={newLead.name}
                onChange={(e) =>
                  setNewLead({ ...newLead, name: e.target.value })
                }
                placeholder="Name *"
                required
                autoFocus
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
              <input
                value={newLead.phone}
                onChange={(e) =>
                  setNewLead({ ...newLead, phone: e.target.value })
                }
                placeholder="Phone *"
                type="tel"
                inputMode="tel"
                required
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
              <input
                value={newLead.email}
                onChange={(e) =>
                  setNewLead({ ...newLead, email: e.target.value })
                }
                placeholder="Email (enables automatic review email)"
                type="email"
                inputMode="email"
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
              <input
                value={newLead.vehicleInfo}
                onChange={(e) =>
                  setNewLead({ ...newLead, vehicleInfo: e.target.value })
                }
                placeholder="Vehicle (optional)"
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
              <input
                value={newLead.notes}
                onChange={(e) =>
                  setNewLead({ ...newLead, notes: e.target.value })
                }
                placeholder="Notes (optional)"
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-zinc-500">
                Status
                <select
                  value={newLead.status}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      status: e.target.value as SubmissionStatus,
                    })
                  }
                  className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs font-bold text-white focus:border-blue-600 focus:outline-none"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                disabled={adding}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Lead"}
              </button>

              {newLead.status === "won" && REVIEW_URL && (
                <span className="text-xs text-green-500">
                  ★ Opens the review text right after saving
                  {newLead.email.trim() && " · review email sends automatically"}
                </span>
              )}
              {addError && (
                <span className="text-xs text-red-400">{addError}</span>
              )}
            </div>
          </form>
        </div>
      )}

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
                    {sub.source === "manual" && " · added manually"}
                  </p>
                </div>

                {/* Status dropdown */}
                <select
                  value={sub.status}
                  onChange={(e) =>
                    updateStatus(sub, e.target.value as SubmissionStatus)
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
                  href={`tel:${phoneDigits(sub.phone)}`}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500"
                >
                  Call {sub.phone}
                </a>
                <a
                  href={`sms:${phoneDigits(sub.phone)}`}
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

                {/* Review-request flow for completed jobs */}
                {sub.status === "won" && sub.phone && REVIEW_URL && (
                  !sub.reviewRequestedAt ? (
                    <a
                      href={reviewSmsHref(sub, false)}
                      onClick={() => markReviewAsked(sub.id, false)}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-500"
                    >
                      ★ Ask for Review
                    </a>
                  ) : !sub.reviewFollowupAt && olderThan24h(sub.reviewRequestedAt) ? (
                    <a
                      href={reviewSmsHref(sub, true)}
                      onClick={() => markReviewAsked(sub.id, true)}
                      className="rounded-md border border-green-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-green-500 hover:bg-green-600 hover:text-white"
                    >
                      ★ Send Reminder
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-500">
                      ★ review asked {timeAgo(sub.reviewRequestedAt)}
                      {sub.reviewFollowupAt && " · reminded"}
                    </span>
                  )
                )}

                {/* Automated email channel — sent server-side, no taps */}
                {sub.status === "won" && sub.reviewEmailSentAt && (
                  <span className="text-xs text-zinc-500">
                    ✉ auto-emailed {timeAgo(sub.reviewEmailSentAt)}
                    {sub.reviewEmailFollowupAt && " · followed up"}
                  </span>
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
