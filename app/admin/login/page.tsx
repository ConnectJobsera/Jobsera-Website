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

  // Forgot-password mode
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

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
      setErrorMessage("Invalid email or password.");
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

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setForgotError("");
    setForgotMessage("");
    setIsSendingReset(true);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      forgotEmail.trim(),
      {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      }
    );

    setIsSendingReset(false);

    // Always show the same success message whether or not the email is a
    // real admin account — this avoids leaking which emails have accounts.
    if (error) {
      setForgotError("Something went wrong. Please try again in a moment.");
      return;
    }

    setForgotMessage(
      "If an account exists for that email, a password reset link has been sent. Check your inbox (and spam folder)."
    );
  }

  const cardStyle: React.CSSProperties = {
    display: "grid",
    gap: "18px",
    padding: "28px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "#ffffff",
    boxShadow: "var(--shadow-sm)",
  };

  const errorStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#fff1f2",
    color: "#dc2626",
    fontSize: "13px",
    lineHeight: 1.5,
  };

  const successStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#f0fdf4",
    color: "#16a34a",
    fontSize: "13px",
    lineHeight: 1.5,
  };

  return (
    <main className="content-page">
      <div className="container">
        <div style={{ maxWidth: "460px", margin: "0 auto" }}>
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
              {mode === "login" ? "Admin Login" : "Reset Password"}
            </h1>

            <p
              style={{
                marginTop: "12px",
                color: "var(--text-secondary)",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              {mode === "login"
                ? "Sign in with your authorized administrator account."
                : "Enter your admin email and we'll send you a link to reset your password."}
            </p>
          </div>

          {mode === "login" ? (
            <>
              <form onSubmit={handleLogin} style={cardStyle}>
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
                  <p role="alert" style={errorStyle}>
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isLoading}
                  style={{ width: "100%", opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setForgotEmail(email);
                  setForgotMessage("");
                  setForgotError("");
                }}
                style={{
                  marginTop: "16px",
                  background: "none",
                  border: "none",
                  color: "var(--jobsera-blue)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot your password?
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleForgotPassword} style={cardStyle}>
                <div className="form-group">
                  <label htmlFor="forgot-email" className="form-label">
                    Email
                  </label>

                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(event) => setForgotEmail(event.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="username"
                    required
                    className="form-input"
                  />
                </div>

                {forgotError && (
                  <p role="alert" style={errorStyle}>
                    {forgotError}
                  </p>
                )}

                {forgotMessage && (
                  <p role="status" style={successStyle}>
                    {forgotMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isSendingReset}
                  style={{ width: "100%", opacity: isSendingReset ? 0.7 : 1 }}
                >
                  {isSendingReset ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setForgotMessage("");
                  setForgotError("");
                }}
                style={{
                  marginTop: "16px",
                  background: "none",
                  border: "none",
                  color: "var(--jobsera-blue)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ← Back to Sign In
              </button>
            </>
          )}
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
