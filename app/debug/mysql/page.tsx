import { query } from "@/app/lib/mysql";

export default async function Page() {
  const versionRows = await query<{ version: string }>(
    "SELECT VERSION() AS version"
  );
  const nowRows = await query<{ now: unknown }>("SELECT NOW() AS now");

  const version = versionRows[0]?.version ?? "unknown";
  const nowRaw = nowRows[0]?.now as unknown;
  const now =
    nowRaw instanceof Date
      ? nowRaw.toISOString()
      : typeof nowRaw === "string"
      ? nowRaw
      : nowRaw != null
      ? String(nowRaw)
      : "unknown";

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>MySQL Connectivity</h1>
      <ul style={{ marginTop: 12, lineHeight: 1.8 }}>
        <li>
          <strong>Version:</strong> {version}
        </li>
        <li>
          <strong>Server time:</strong> {now}
        </li>
      </ul>
      <p style={{ marginTop: 12, color: "#666" }}>
        If values render above, your local MySQL connection is working.
      </p>
    </div>
  );
}
