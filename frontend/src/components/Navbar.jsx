"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "60px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: 28, height: 28,
          background: "linear-gradient(135deg, var(--accent), #a78bfa)",
          borderRadius: "7px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px",
        }}>⚡</div>
        <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}>
          CausalFunnel
        </span>
        <span style={{
          fontSize: "11px", color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          background: "var(--surface-2)", padding: "2px 8px",
          borderRadius: "4px", border: "1px solid var(--border)",
          marginLeft: "4px",
        }}>analytics</span>
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        {[
          { label: "Demo Page", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
        ].map(({ label, href }) => (
          <Link key={href} href={href} style={{
            padding: "6px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: "13px",
            fontWeight: 500,
            color: pathname === href ? "var(--text-primary)" : "var(--text-secondary)",
            background: pathname === href ? "var(--surface-2)" : "transparent",
            border: pathname === href ? "1px solid var(--border)" : "1px solid transparent",
            transition: "all 0.15s",
          }}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}