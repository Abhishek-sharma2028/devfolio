import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import bodyHtml from "../devfolio-body.html?raw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Devfolio — Make your work impossible to miss" },
      { name: "description", content: "Devfolio — a beautiful student developer portfolio and collaboration hub." },
      { property: "og:title", content: "Devfolio — Make your work impossible to miss" },
      { property: "og:description", content: "A beautiful student developer portfolio and collaboration hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f7f6f2" },
    ],
    links: [
      { rel: "stylesheet", href: "/devfolio/styles.css" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    // Route the original demo "Log in" / "Create portfolio" buttons to real accounts.
    let signedIn = false;
    const relabel = () => {
      document.querySelectorAll<HTMLElement>(".open-login").forEach((el) => {
        el.textContent = signedIn ? "Dashboard" : "Log in";
      });
    };
    supabase.auth.getSession().then(({ data }) => {
      signedIn = !!data.session;
      relabel();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      signedIn = !!session;
      relabel();
    });
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest(".open-login, .open-builder");
      if (!el) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (signedIn) navigate({ to: "/dashboard" });
      else navigate({ to: "/auth", search: { redirect: "/dashboard" } });
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      sub.subscription.unsubscribe();
    };
  }, [navigate]);
  useEffect(() => {
    // Original site's vanilla interaction script, run once after the markup is in place.
    const s = document.createElement("script");
    s.src = "/devfolio/script.js?v=10";
    document.body.appendChild(s);
    return () => s.remove();
  }, []);
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
