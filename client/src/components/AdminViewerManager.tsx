import { useState } from "react";
import { UserRound, ShieldCheck, ShieldAlert } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminViewerManager() {
  const utils = trpc.useUtils();
  const viewers = trpc.admin.viewers.list.useQuery();
  const setRole = trpc.admin.viewers.setRole.useMutation({ onSuccess: () => utils.admin.viewers.list.invalidate() });
  const [filter, setFilter] = useState("");
  const query = filter.trim().toLowerCase();
  const rows = (viewers.data ?? []).filter(viewer => [viewer.email, viewer.displayName, viewer.role].filter(Boolean).join(" ").toLowerCase().includes(query));

  return <>
    <header className="admin-heading"><div><p>Jafory administration</p><h1>Viewers & users</h1><span>Review customer accounts and control whether an account is a viewer or an administrator. Passwords and authentication secrets are never shown here.</span></div></header>
    <section className="admin-panel admin-viewers-panel">
      <div className="admin-panel__header"><div><h2>Registered accounts</h2><p className="admin-muted">{viewers.data?.length ?? 0} account{viewers.data?.length === 1 ? "" : "s"} in the V2 project.</p></div><label className="admin-field admin-viewer-search"><span>Search accounts</span><input value={filter} onChange={event => setFilter(event.target.value)} placeholder="Email or name" /></label></div>
      {viewers.isLoading ? <p className="admin-empty">Loading accounts…</p> : viewers.isError ? <p className="admin-empty"><ShieldAlert size={18} /> Accounts could not load. Refresh this panel and try again.</p> : rows.length ? <div className="admin-list admin-list--viewers">{rows.map(viewer => <article key={viewer.id}><div className="admin-viewer-identity"><span className="admin-viewer-avatar"><UserRound size={17} /></span><div><strong>{viewer.displayName || viewer.email || "Unnamed viewer"}</strong><span>{viewer.email || "Email unavailable"} · Joined {new Date(viewer.createdAt).toLocaleDateString()}</span></div></div><div className="admin-viewer-actions"><span className={`status status--${viewer.role}`}>{viewer.role === "admin" ? <><ShieldCheck size={14} /> Administrator</> : "Viewer"}</span><button type="button" disabled={setRole.isPending} onClick={() => setRole.mutate({ id: viewer.id, role: viewer.role === "admin" ? "user" : "admin" })}>{viewer.role === "admin" ? "Make viewer" : "Make administrator"}</button></div></article>)}</div> : <p className="admin-empty">No accounts match this search.</p>}
    </section>
  </>;
}
