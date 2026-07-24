# 🌙 Midnight Economy

**Açık Dünya Ekonomi Simülasyon Oyunu — Mobile Edition**

## 📖 Hakkında

Midnight, Schedule 1 oyunun mekaniklerinden esinlenerek geliştirilmiş, React Native ile mobil cihazlara uyarlanmış bir ekonomi simülasyonu oyunudur. Oyuncular bir şehirde küçük bir işletmeden başlayarak, üretim zinciri kurarak ve NPC'ler ile etkileşime girerek ekonomik bir imparatorluk inşa ederler.

## 🎮 Ana Özellikler

✅ **Açık Dünya Şehir** — Kesintisiz, chunk-based yükleme ile performanslı ortam
✅ **Idle Ekonomi** — Oyuncu çevrim dışıyken de gelir ve üretim devam eder
✅ **Dinamik NPC Sistemi** — Müşteriler, tedarikçiler, rakipler ve otorite
✅ **Multiplayer Sync** — Firebase Realtime Database ile gerçek zamanlı senkronizasyon
✅ **Karakter Özelleştirmesi** — JDM estetiğiyle layered customization
✅ **Performans Optimizasyonu** — 60 FPS hedefli, düşük-orta seviye cihazlarda stabil

## 🛠 Teknik Stack

- **Framework:** React Native (Expo)
- **Multiplayer:** Firebase Realtime Database (JS SDK)
- **State Management:** Zustand
- **Build:** GitHub Actions → APK
- **Language:** TypeScript

## 📦 Kurulum

```bash
npm install
npx expo start
```

### Android APK Derleme

```bash
npm run build:apk
```

## 🏗 Proje Yapısı

```
src/
├── engine/              # Game Engine (Idle, ekonomi hesaplamaları)
├── store/               # Zustand state management
├── screens/             # React Native ekranları
├── components/          # UI bileşenleri
├── assets/              # Görseller, ikonlar, spriteleri
├── constants/           # Sabitler (NPC davranışları, harita verisi)
├── utils/               # Yardımcı fonksiyonlar
└── firebase/            # Firebase konfigürasyonu
```

## 🎯 Geliştirme Akışı

1. Her commit GitHub Actions tarafından trigger edilir
2. APK otomatik olarak derlenir
3. Release artifact olarak yayınlanır
4. İndirilebilir link sağlanır

## 📝 Lisans

Özel kullanım — Telif hakkı © XeroKai
