"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // "checking" -> "valid" -> show the form
  // "checking" -> "invalid" -> the reset link is missing/expired
  const [linkStatus, setLinkStatus] = useState<
    "checking" | "valid" | "invalid"
  >("checking");

  useEffect(() => {
    const supabase = createClient();

    // Clicking the emailed reset link redirects here with a recovery token
    // in the URL. supabase-js parses it automatically and fires this event
    // once a valid recovery session is established.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setLinkStatus("valid");
        }
      }
    );

    // Fallback: the event can fire before this listener is attached, so
    // also check directly for an existing session on mount.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setLinkStatus("valid");
      } else {
        // Give the URL-parsing/auth-event a moment before giving up.
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: retry }) => {
            setLinkStatus(retry.session ? "valid" : "invalid");
          });
        }, 1200);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMessage(error.message || "Unable to update your password.");
      setIsLoading(false);
      return;
    }

    setSuccessMessage("Your password has been updated successfully.");
    setPassword("");
    setConfirmPassword("");
    setIsLoading(false);

    setTimeout(() => {
      router.replace("/admin/login");
      router.refresh();
    }, 1500);
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
              Set New Password
            </h1>

            <p
              style={{
                marginTop: "12px",
                color: "var(--text-secondary)",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              {linkStatus === "invalid"
                ? "This reset link is invalid or has expired."
                : "Enter a new password for your Jobsera administrator account."}
            </p>
          </div>

          {linkStatus === "checking" && (
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Verifying your reset link...
            </p>
          )}

          {linkStatus === "invalid" && (
            <div style={cardStyle}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Reset links expire after a short time and can only be used
                once. Request a new one from the login page.
              </p>

              <a
                href="/admin/login"
                className="button button-primary"
                style={{ width: "100%", textAlign: "center" }}
              >
                Back to Login
              </a>
            </div>
          )}

          {linkStatus === "valid" && (
            <form onSubmit={handlePasswordUpdate} style={cardStyle}>
              <div className="form-group">
                <label htmlFor="new-password" className="form-label">
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter a new password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  minLength={8}
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

              {successMessage && (
                <p
                  role="status"
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#f0fdf4",
                    color: "#16a34a",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                className="button button-primary"
                disabled={isLoading}
                style={{ width: "100%", opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? "Updating password..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
