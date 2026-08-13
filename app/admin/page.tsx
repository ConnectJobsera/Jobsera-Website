import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !adminUser) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  // Temporary diagnostic: check whether the authenticated
  // Supabase session is recognized as an admin.
  const { data: isAdminResult, error: isAdminError } =
    await supabase.rpc("is_admin");

  const adminDiagnostic = isAdminError
    ? `ERROR: ${isAdminError.message}`
    : String(isAdminResult);

  return (
    <main className="content-page">
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          <div>
            <p className="eyebrow">ADMINISTRATION</p>

            <h1>Admin Dashboard</h1>

            <p className="page-intro">
              Manage Jobsera content from one secure dashboard.
            </p>

            <p style={{ marginTop: "16px", fontSize: "14px" }}>
              Temporary is_admin() diagnostic:{" "}
              <strong>{adminDiagnostic}</strong>
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="card-grid">
          <Link href="/admin/jobs" className="card">
            <div className="card-content">
              <p className="eyebrow">JOBS</p>
              <h2 className="card-title">Manage Jobs</h2>
              <p className="card-description">
                Add, edit and remove job opportunities.
              </p>
            </div>
          </Link>

          <Link href="/admin/blogs" className="card">
            <div className="card-content">
              <p className="eyebrow">BLOGS</p>
              <h2 className="card-title">Manage Blogs</h2>
              <p className="card-description">
                Add, edit and manage career articles.
              </p>
            </div>
          </Link>

          <Link href="/admin/highlights" className="card">
            <div className="card-content">
              <p className="eyebrow">HIGHLIGHTS</p>
              <h2 className="card-title">Manage Highlights</h2>
              <p className="card-description">
                Control the homepage highlight messages.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
