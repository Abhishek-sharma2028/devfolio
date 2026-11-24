import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteBar } from "@/components/SiteBar";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Devfolio" },
      { name: "description", content: "Choose a new password for your Devfolio account." },
      { property: "og:title", content: "Set a new password — Devfolio" },
      { property: "og:description", content: "Choose a new password for your Devfolio account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }
  return (
    <div className="min-h-screen bg-background">
      <SiteBar />
      <form onSubmit={submit} className="mx-auto grid max-w-md gap-4 px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tighter">New <em className="display-em">password</em></h1>
        <Label htmlFor="pw">Password</Label>
        <Input id="pw" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-card" />
        <Button type="submit" disabled={busy} className="h-11">Save password</Button>
      </form>
    </div>
  );
}
