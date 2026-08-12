"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

       if (error || !data.user) {
      // TEMPORARY DIAGNOSTIC — remove after debugging.
      setErrorMessage(
        `Supabase error: ${error?.message ?? "no user returned"} (status: ${
          (error as any)?.status ?? "n/a"
        })`
      );
      setIsLoading(false);
      return;
    }


    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !adminUser) {
      await supabase.auth.signOut();

      setErrorMessage(
        "You do not have permission to access the admin panel."
      );

      setIsLoading(false);
      return;
    }

    const nextPath = searchParams.get("next");

    if (nextPath && nextPath.startsWith("/admin")) {
      router.replace(nextPath);
    } else {
      router.replace("/admin");
    }

    router.refresh();
  }

  return (
    <main className="content-page">
      <div className="container">
        <div
          style={{
            maxWidth: "460px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "30px" }}>
            <p className="eyebrow">ADMINISTRATION</p>

            <h1
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
                fontWeight: 800,
              }}
            >
              Admin Login
            </h1>

            <p
              style={{
                marginTop: "12px",
                color: "var(--text-secondary)",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              Sign in with your authorized administrator account.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            style={{
              display: "grid",
              gap: "18px",
              padding: "28px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              background: "#ffffff",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="form-group">
              <label htmlFor="admin-email" className="form-label">
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password" className="form-label">
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="form-input"
              />
            </div>

            {errorMessage && (
              <p
                role="alert"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "#fff1f2",
                  color: "#dc2626",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="button button-primary"
              disabled={isLoading}
              style={{
                width: "100%",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="content-page">
          <div className="container">
            <p>Loading admin login...</p>
          </div>
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
