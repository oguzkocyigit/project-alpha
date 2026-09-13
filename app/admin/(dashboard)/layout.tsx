import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-surface-border bg-surface/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href="/admin/protocol"
            className="font-heading text-lg font-semibold uppercase tracking-wide"
          >
            Yönetim Paneli
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/protocol" className="text-muted hover:text-foreground">
              Protokol
            </Link>
            <Link href="/admin/workout" className="text-muted hover:text-foreground">
              Antrenman
            </Link>
            <Link href="/admin/library" className="text-muted hover:text-foreground">
              Arşiv
            </Link>
            <Link href="/admin/settings" className="text-muted hover:text-foreground">
              Ayarlar
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-surface-border px-3 py-1.5 text-muted hover:border-accent hover:text-foreground"
              >
                Çıkış
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
