import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";

type ContentLink = {
  id: string;
  group_key: string;
  sort_order: number;
  title: string;
  url: string;
  is_active: boolean;
};

const groups = [
  {
    key: "home",
    title: "Homepage Links",
    description: "Five links displayed in the related-links box on the homepage.",
  },
  {
    key: "job_middle",
    title: "Job Page — Middle Links",
    description: "Five links displayed around the middle of individual job pages.",
  },
  {
    key: "job_bottom",
    title: "Job Page — Bottom Links",
    description: "Five links displayed below the Apply Now section.",
  },
  {
    key: "blog_middle_1",
    title: "Blog Page — Middle Links 1",
    description: "First five-link box displayed in the middle of individual blog pages.",
  },
  {
    key: "blog_middle_2",
    title: "Blog Page — Middle Links 2",
    description: "Second five-link box displayed later on individual blog pages.",
  },
  {
    key: "blog_bottom",
    title: "Blog Page — Bottom Links",
    description: "Five links displayed at the bottom of individual blog pages.",
  },
] as const;

async function saveLink(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminUser) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const groupKey = String(formData.get("group_key") || "");
  const sortOrder = Number(formData.get("sort_order"));
  const title = String(formData.get("title") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const isActive = formData.get("is_active") === "true";

  const allowedGroups = groups.map((group) => group.key);

  if (!allowedGroups.includes(groupKey as (typeof groups)[number]["key"])) {
    throw new Error("Invalid link group.");
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 1 || sortOrder > 5) {
    throw new Error("Invalid link position.");
  }

  if (!title || !url) {
    throw new Error("Title and URL are required.");
  }

  if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
    throw new Error(
      "URL must start with https://, http://, or / for an internal page."
    );
  }

  const { error } = await supabase.from("content_links").upsert(
    {
      group_key: groupKey,
      sort_order: sortOrder,
      title,
      url,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "group_key,sort_order",
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/blogs");
  revalidatePath("/admin/links");
}

async function toggleLink(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminUser) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const id = String(formData.get("id") || "");
  const nextActive = String(formData.get("next_active")) === "true";

  if (!id) {
    throw new Error("Missing link ID.");
  }

  const { error } = await supabase
    .from("content_links")
    .update({
      is_active: nextActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/blogs");
  revalidatePath("/admin/links");
}

export default async function AdminLinksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminUser) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const { data: links, error: linksError } = await supabase
    .from("content_links")
    .select(
      "id, group_key, sort_order, title, url, is_active"
    )
    .order("group_key", { ascending: true })
    .order("sort_order", { ascending: true });

  if (linksError) {
    throw new Error(linksError.message);
  }

  const contentLinks = (links || []) as ContentLink[];

  function getLink(groupKey: string, sortOrder: number) {
    return contentLinks.find(
      (link) =>
        link.group_key === groupKey && link.sort_order === sortOrder
    );
  }

  return (
    <main className="content-page">
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div>
            <p className="eyebrow">LINK MANAGEMENT</p>

            <h1>Manage Links</h1>

            <p className="page-intro">
              Manage the related links displayed across Jobsera pages.
            </p>
          </div>

          <Link
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "42px",
              padding: "0 16px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "#fff",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            ← Dashboard
          </Link>
        </div>

        {groups.map((group) => (
          <section
            key={group.key}
            style={{
              marginBottom: "28px",
              padding: "24px",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              background: "#fff",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <p className="eyebrow">LINK GROUP</p>

              <h2
                style={{
                  margin: "4px 0 8px",
                  fontSize: "24px",
                  lineHeight: 1.2,
                }}
              >
                {group.title}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {group.description}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {[1, 2, 3, 4, 5].map((position) => {
                const link = getLink(group.key, position);

                return (
                  <form
                    key={`${group.key}-${position}`}
                    action={saveLink}
                    style={{
                      padding: "16px",
                      border: "1px solid var(--border)",
                      borderRadius: "14px",
                      background: "#fafbfc",
                    }}
                  >
                    <input
                      type="hidden"
                      name="group_key"
                      value={group.key}
                    />

                    <input
                      type="hidden"
                      name="sort_order"
                      value={position}
                    />

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "42px minmax(0, 1fr) minmax(0, 1.4fr) auto",
                        alignItems: "end",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "7px",
                            fontSize: "12px",
                            fontWeight: 750,
                            color: "var(--text-secondary)",
                          }}
                        >
                          #
                        </label>

                        <div
                          style={{
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid var(--border)",
                            borderRadius: "9px",
                            background: "#fff",
                            fontSize: "14px",
                            fontWeight: 800,
                          }}
                        >
                          {position}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`${group.key}-title-${position}`}
                          style={{
                            display: "block",
                            marginBottom: "7px",
                            fontSize: "12px",
                            fontWeight: 750,
                            color: "var(--text-secondary)",
                          }}
                        >
                          Link heading
                        </label>

                        <input
                          id={`${group.key}-title-${position}`}
                          name="title"
                          type="text"
                          defaultValue={link?.title || ""}
                          placeholder="e.g. Latest Government Jobs"
                          required
                          maxLength={150}
                          style={{
                            width: "100%",
                            height: "44px",
                            padding: "0 12px",
                            border: "1px solid var(--border)",
                            borderRadius: "9px",
                            background: "#fff",
                            color: "var(--text-primary)",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`${group.key}-url-${position}`}
                          style={{
                            display: "block",
                            marginBottom: "7px",
                            fontSize: "12px",
                            fontWeight: 750,
                            color: "var(--text-secondary)",
                          }}
                        >
                          URL
                        </label>

                        <input
                          id={`${group.key}-url-${position}`}
                          name="url"
                          type="text"
                          defaultValue={link?.url || ""}
                          placeholder="https://example.com/page"
                          required
                          style={{
                            width: "100%",
                            height: "44px",
                            padding: "0 12px",
                            border: "1px solid var(--border)",
                            borderRadius: "9px",
                            background: "#fff",
                            color: "var(--text-primary)",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div>
                        <input
                          type="hidden"
                          name="is_active"
                          value={link?.is_active ? "true" : "false"}
                        />

                        <button
                          type="submit"
                          style={{
                            height: "44px",
                            padding: "0 16px",
                            border: 0,
                            borderRadius: "9px",
                            background: "var(--jobsera-blue)",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 750,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Save Link
                        </button>
                      </div>
                    </div>

                    {link && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          marginTop: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: link.is_active
                              ? "#16803c"
                              : "var(--text-muted)",
                            fontWeight: 700,
                          }}
                        >
                          {link.is_active ? "● Active" : "● Inactive"}
                        </span>

                        <button
                          type="submit"
                          formAction={toggleLink}
                          name="id"
                          value={link.id}
                          style={{
                            border: 0,
                            background: "transparent",
                            color: link.is_active
                              ? "var(--jobsera-red)"
                              : "var(--jobsera-blue)",
                            fontSize: "12px",
                            fontWeight: 750,
                            cursor: "pointer",
                            padding: "4px 0",
                          }}
                        >
                          {link.is_active
                            ? "Deactivate link"
                            : "Activate link"}
                        </button>

                        <input
                          type="hidden"
                          name="next_active"
                          value={link.is_active ? "false" : "true"}
                        />
                      </div>
                    )}
                  </form>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
