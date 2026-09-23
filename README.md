# Bölüş

Bölüş, grup halinde yapılan ortak harcamaları takip etmek ve kişiler arasındaki ödeme planını hesaplamak için geliştirilmiş basit bir web uygulamasıdır.

## Proje Hakkında

Bölüş; arkadaş grupları, geziler veya ortak yaşam giderleri gibi paylaşılan harcamaların tek yerde yönetilmesini sağlar. Kullanıcılar:

- Birden fazla grup oluşturabilir.
- Gruplara kişi ekleyebilir.
- Ortak harcamalar ekleyebilir, düzenleyebilir ve silebilir.
- Her harcamaya katılan kişileri seçebilir.
- Harcamayı kimin ödediğini belirleyebilir.
- Uygulamanın hesapladığı ödeme planını görüntüleyebilir.

Uygulama verileri şu anda tarayıcının `localStorage` alanında saklanır. Bu nedenle veriler yalnızca kullanılan tarayıcı profili içinde kalıcıdır; cihazlar veya kullanıcılar arasında paylaşılmaz ve senkronize edilmez.

## Projenin Amacı

Bu proje, yapay zekâ destekli geliştirme araçlarından yararlanılarak hazırlanmıştır. Amaç, büyük ölçekli veya production seviyesinde bir finans sistemi oluşturmak değil; çalışan ve tamamlanmış bir web uygulaması üzerinden yazılım geliştirme sürecini uçtan uca deneyimlemektir.

Projenin başlıca öğrenme hedefleri şunlardır:

- Çalışan bir frontend uygulamasını tamamlamak.
- Yapay zekâ destekli yazılım geliştirme sürecini deneyimlemek.
- Git ve GitHub kullanımını uygulamalı olarak öğrenmek.
- Bir frontend projesini internete deploy etmek.
- Geliştirme → version control → GitHub → deployment akışını uçtan uca uygulamak.

## Özellikler

- Çoklu grup yönetimi
- Grup oluşturma, yeniden adlandırma ve silme
- Kişi ekleme ve güvenli silme
- Harcama ekleme, düzenleme ve silme
- Harcamaya katılan kişileri seçme
- Ödeyen kişiyi belirleme
- Toplam harcama hesaplama
- Kişiler arası ödeme planı (settlement) hesaplama
- `localStorage` ile veri kalıcılığı
- Eski `localStorage` yapısından migration desteği
- Responsive arayüz

## Teknolojiler

- React
- TypeScript
- Vite
- CSS
- Web Storage API (`localStorage`)

## Nasıl Çalışır?

Her grup kendi kişi ve harcama verisini taşır:

```text
Group
├── people[]
└── expenses[]
```

Settlement sistemi, grubun harcamalarını, ödemeyi yapan kişileri ve harcamalara katılan kişileri kullanarak herkesin net borç veya alacak durumunu hesaplar. Ardından hesapların kapanması için gereken ödeme transferlerini oluşturur.

Para hesaplarında floating-point kaynaklı yuvarlama sorunlarını azaltmak için tutarlar tam sayı kuruş üzerinden işlenir.

## Yerelde Çalıştırma

Projeyi klonlayın ve proje klasörüne geçin:

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_FOLDER>
```

Bağımlılıkları yükleyip geliştirme sunucusunu başlatın:

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak [http://localhost:5173](http://localhost:5173) adresinde açılır.

## Build

Production build oluşturmak için:

```bash
npm run build
```

Build çıktısı `dist` klasöründe oluşturulur.

## 🌐 Canlı Demo

Canlı demo bağlantısı deployment tamamlandıktan sonra eklenecektir.

## 📸 Ekran Görüntüsü

Proje ekran görüntüsü GitHub yayını öncesinde eklenecektir.

## Veri Saklama

Bölüş'ün mevcut sürümünde backend veya veritabanı bulunmaz. Grup, kişi ve harcama verileri tarayıcının `localStorage` alanında saklanır.

Bu yaklaşım kapsamında veriler:

- Aynı tarayıcı ve profil içinde sayfa yenilense de korunur.
- Başka cihazlara otomatik olarak senkronize edilmez.
- Farklı kullanıcılarla paylaşılmaz.

## Sınırlılıklar

Aşağıdaki maddeler birer hata değil, uygulamanın mevcut sürüm kapsamını tanımlar:

- Backend veya merkezi bir veritabanı bulunmaz.
- Kullanıcı hesabı ve kimlik doğrulama sistemi bulunmaz.
- Gruplar farklı kullanıcılar arasında paylaşılmaz.
- Veri kalıcılığı kullanılan tarayıcının `localStorage` alanıyla sınırlıdır.

## 🤖 AI Destekli Geliştirme

Bu projede kod üretimi, refactoring, test senaryolarının oluşturulması ve geliştirme sürecinin farklı aşamalarında yapay zekâ destekli araçlardan yararlanılmıştır. Üretilen çalışmalar proje ihtiyaçlarına göre gözden geçirilmiş ve aşamalı olarak geliştirilmiştir.

Bölüş, aynı zamanda yapay zekâ destekli bir geliştirme workflow'unu deneyimlemek ve bu yaklaşımı Git, GitHub ve deployment süreçleriyle birlikte uygulamak amacı taşır.
