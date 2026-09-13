# Protokol

Danışanlara supplement / vitamin / peptid / anabolik kullanım protokolünü haftalık olarak gösteren, tek kişilik (koç) yönetim paneli + müşteriye özel, girişsiz mobil görünümlü sayfa.

## Yerel Kurulum

1. Bağımlılıkları kur:
   ```bash
   npm install
   ```
2. `.env.example` dosyasını `.env` olarak kopyala ve doldur:
   - `DATABASE_URL`: bir Postgres bağlantı adresi (yerelde kendi Postgres'in, prod'da Neon).
   - `ADMIN_USERNAME`: panele giriş kullanıcı adın.
   - `ADMIN_PASSWORD_HASH`: `node -e "console.log(require('bcryptjs').hashSync('sifren', 10))"` ile üret.
     **Önemli:** hash içindeki her `$` işaretini `\$` olarak yaz (`$2b$10$...` → `\$2b\$10\$...`). Next.js `.env` dosyalarında `$DEGISKEN` kalıplarını otomatik genişletiyor; kaçış yapılmazsa hash bozulur ve giriş çalışmaz.
   - `SESSION_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` ile üret.
3. Veritabanı şemasını uygula ve örnek veriyi yükle:
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```
   Seed komutu, oluşturduğu müşterinin genel linkini (`/p/<slug>`) terminale yazdırır.
4. Geliştirme sunucusunu başlat:
   ```bash
   npm run dev
   ```
5. `http://localhost:3000/admin` → giriş yap → `Protokol` sekmesinden ürün ekle/düzenle.
   `http://localhost:3000/admin/settings` → müşteriye gönderilecek linki kopyala.

## Vercel'e Deploy

1. Projeyi GitHub'a push et, Vercel'de import et (Next.js otomatik algılanır).
2. Vercel proje ayarlarında (Environment Variables) aynı 4 değişkeni tanımla: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`. (Vercel arayüzünde `$` kaçışına gerek yok, tam hash'i olduğu gibi yapıştır.)
3. Prod veritabanı için ücretsiz bir [Neon](https://neon.tech) Postgres projesi oluştur, bağlantı adresini `DATABASE_URL` olarak gir.
4. İlk deploy öncesi migration'ları prod veritabanına uygula (kendi terminalinden, prod `DATABASE_URL` ile):
   ```bash
   DATABASE_URL="<neon-baglanti-adresin>" npx prisma migrate deploy
   DATABASE_URL="<neon-baglanti-adresin>" npm run seed
   ```
5. Deploy et. `https://<proje>.vercel.app/admin` ve `/p/<slug>` linklerinin çalıştığını doğrula.

## Yapı

- `app/admin/**` — girişli yönetim paneli (ürün CRUD, ayarlar/link).
- `app/p/[slug]/**` — girişsiz, müşteriye özel haftalık protokol sayfası.
- `proxy.ts` — `/admin/**` altını login zorunluluğu ile korur (`/admin/login` hariç).
- `prisma/schema.prisma` — `Client` ve `ProtocolItem` veri modeli.
