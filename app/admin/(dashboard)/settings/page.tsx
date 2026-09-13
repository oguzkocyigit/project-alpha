import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import CopyLinkButton from "./CopyLinkButton";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const client = await prisma.client.findFirst();
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const publicUrl = client ? `${protocol}://${host}/p/${client.slug}` : null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide">Ayarlar</h1>

      <div className="rounded-lg border border-surface-border bg-surface p-5">
        <h2 className="mb-1 text-sm font-medium text-muted">Müşteri</h2>
        <p className="mb-4 text-lg">{client?.name ?? "—"}</p>

        <h2 className="mb-1 text-sm font-medium text-muted">Müşteri Linki</h2>
        {publicUrl ? (
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg border border-surface-border bg-background px-3 py-2 text-sm">
              {publicUrl}
            </code>
            <CopyLinkButton url={publicUrl} />
          </div>
        ) : (
          <p className="text-sm text-muted">
            Henüz müşteri kaydı yok. <code>npm run seed</code> çalıştırın.
          </p>
        )}
        <p className="mt-3 text-xs text-muted">
          Bu link giriş gerektirmez — müşteriye doğrudan gönderebilirsiniz.
        </p>
      </div>
    </div>
  );
}
