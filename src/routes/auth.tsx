import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import "@lovable.dev/cloud-auth-js/styles.css";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteBar } from "@/components/SiteBar";

const safePath = (p: unknown) => (typeof p === "string" && p.startsWith("/") && !p.startsWith("//") ? p : "/dashboard");

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string | undefined } => ({ redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined }),
  head: () => ({
    meta: [
      { title: "Sign in — Devfolio" },
      { name: "description", content: "Sign in or create your Devfolio account to build and share your portfolio." },
      { property: "og:title", content: "Sign in — Devfolio" },
      { property: "og:description", content: "Create your Devfolio account and share your work anywhere." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const GoogleLogo = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
);

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const target = safePath(
    search.redirect ?? (typeof window !== "undefined" ? sessionStorage.getItem("devfolio-after-auth") : null),
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: target, replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((e, session) => {
      if (e === "SIGNED_IN" && session) navigate({ to: target, replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate, target]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + target },
        });
        if (error) throw error;
        if (!data.session) setNotice("Check your inbox to confirm your email, then sign in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("If that email has an account, a reset link is on its way.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider: "google" | "lovable") {
    sessionStorage.setItem("devfolio-after-auth", target);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/auth" });
    if (result.error) toast.error(result.error.message ?? "Sign-in failed");
  }

  const title = mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Welcome back";

  return (
    <div className="min-h-screen bg-background">
      <SiteBar />
      <main className="mx-auto grid max-w-md gap-6 px-6 py-16">
        <div>
          <p className="eyebrow-label">Your devfolio account</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tighter">
            {title.split(" ").slice(0, -1).join(" ")} <em className="display-em">{title.split(" ").slice(-1)}</em>
          </h1>
        </div>
        {mode !== "forgot" && (
          <div className="grid gap-3">
            <Button type="button" variant="outline" className="h-11 bg-card" onClick={() => oauth("google")}>
              <GoogleLogo /> Continue with Google
            </Button>
            <button type="button" className="lovable-auth-button" onClick={() => oauth("lovable")}>
              Continue with Lovable
            </button>
            <div className="eyebrow-label flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
            </div>
          </div>
        )}
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-card" />
          </div>
          {mode !== "forgot" && (
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-card" />
            </div>
          )}
          <Button type="submit" disabled={busy} className="h-11">
            {busy ? "Please wait…" : mode === "signup" ? "Create account ↗" : mode === "forgot" ? "Send reset link" : "Sign in ↗"}
          </Button>
          {notice && <p className="rounded-sm bg-accent p-3 text-sm">{notice}</p>}
        </form>
        <div className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              <button className="underline-offset-4 hover:underline" onClick={() => setMode("signup")}>New here? Create an account</button>
              <button className="underline-offset-4 hover:underline" onClick={() => setMode("forgot")}>Forgot password?</button>
            </>
          ) : (
            <button className="underline-offset-4 hover:underline" onClick={() => setMode("signin")}>Already have an account? Sign in</button>
          )}
        </div>
      </main>
    </div>
  );
}
