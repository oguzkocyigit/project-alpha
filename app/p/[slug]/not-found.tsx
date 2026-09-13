export default function NotFound() {
  return (
    <main className="mil-atmosphere flex min-h-dvh w-full flex-col items-center justify-center px-4 text-center font-sans">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-mil-danger">
        Erişim Reddedildi
      </p>
      <h1 className="font-heading mt-2 text-2xl font-semibold uppercase tracking-wide text-mil-ink">
        Kayıt Bulunamadı
      </h1>
      <p className="mt-2 max-w-xs text-sm text-mil-muted">
        Bu link geçerli değil. Lütfen size iletilen linki kontrol edin.
      </p>
    </main>
  );
}
