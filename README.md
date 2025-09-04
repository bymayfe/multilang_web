# 🌍 MultiLang_Web

Modern, çok dilli web uygulaması - **Go Backend** + **Next.js Frontend** + **MongoDB** + **Docker**

![Go](https://img.shields.io/badge/Go-1.24.4-00ADD8?style=for-the-badge&logo=go)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-000000?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

## 📋 Özellikler

### 🔐 **Güvenlik & Authentication**

- **JWT tabanlı kimlik doğrulama** (72 saatlik token süresi)
- **Session management** sistemi (multi-device support)
- **Secure password hashing** (bcrypt ile 14 round)
- **IP & Device tracking** (mobile, tablet, desktop detection)
- **Auto session cleanup** (expired session'ları otomatik temizleme)

### 🎨 **Frontend Features**

- **Next.js 15** (App Router + Turbopack)
- **TypeScript** desteği
- **Tailwind CSS 4** (responsive design)
- **Dark/Light theme** (next-themes)
- **Animations** (AOS, Lottie, React Typewriter)
- **Modern UI Components** (React Icons, Marquee)

### ⚡ **Backend Architecture**

- **RESTful API** (Gorilla Mux router)
- **MongoDB** integration (native driver v2)
- **Middleware system** (CORS, Auth)
- **Performance optimized** (MongoDB indexing)
- **Environment configuration** (.env support)

## 🚀 Hızlı Kurulum

### Docker ile Çalıştırma (Önerilen)

```bash
# Repository'yi klonla
git clone https://github.com/bymayfe/multilang_web.git
cd MultiLang_Web

# Environment dosyasını oluştur
cp .env.example .env

# Docker Compose ile başlat
docker-compose up --build

# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

### Manuel Kurulum

#### Backend (Go)

```bash
cd go/
go mod download
go run main.go
```

#### Frontend (Next.js)

```bash
cd nextjs/
npm install
npm run dev
```

## 📁 Proje Yapısı

```
MultiLang_Web/
├── 📂 go/                          # Backend (Go)
│   ├── main.go                     # Ana server dosyası
│   ├── middleware/
│   │   └── auth.go                 # JWT & Session middleware
│   ├── models/
│   │   ├── user.go                 # User model
│   │   └── session.go              # Session model
│   ├── routes/
│   │   ├── handlers.go             # API handlers
│   │   └── router.go               # Route definitions
│   └── utils/
│       ├── hash.go                 # Password hashing
│       ├── jwt.go                  # JWT operations
│       └── userid.go               # User ID generation
├── 📂 nextjs/                      # Frontend (Next.js)
│   ├── app/                        # App Router
│   ├── components/                 # Reusable components
│   ├── providers/
│   │   └── AuthProvider/           # Custom auth system
│   │       ├── index.tsx           # Main provider
│   │       ├── hook.ts             # useAuth hook
│   │       ├── storage.ts          # Storage adapters
│   │       └── index.tsx           # Type definitions
│   ├── scripts/
│   │   └── services/
│   │       └── auth.ts             # API service calls
│   ├── public/                     # Static files
│   └── styles/                     # Global styles
├── docker-compose.yml              # Development setup
└── README.md                       # Bu dosya
```

## 🔧 API Endpoints

### 🔓 **Açık Endpoints**

| Method | Endpoint       | Açıklama             |
| ------ | -------------- | -------------------- |
| `POST` | `/user/signup` | Yeni kullanıcı kaydı |
| `POST` | `/user/login`  | Kullanıcı girişi     |

### 🔒 **Korumalı Endpoints** (JWT Required)

| Method | Endpoint           | Açıklama                   |
| ------ | ------------------ | -------------------------- |
| `GET`  | `/user/session`    | Kullanıcı oturum bilgileri |
| `GET`  | `/user/sessions`   | Aktif oturum listesi       |
| `POST` | `/user/logout`     | Çıkış (tek cihaz)          |
| `POST` | `/user/logout-all` | Tüm cihazlardan çıkış      |
| `GET`  | `/user/protected`  | Örnek korumalı endpoint    |

### 📊 **Request/Response Örnekleri**

#### Kullanıcı Kaydı

```bash
curl -X POST http://localhost:3001/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ali Veli",
    "email": "ali@example.com",
    "password": "güçlü123şifre",
    "username": "aliveli",
    "firstname": "Ali",
    "lastname": "Veli",
    "age": 25
  }'
```

#### Giriş Yapma

```bash
curl -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ali@example.com",
    "password": "güçlü123şifre"
  }'
```

#### Korumalı Endpoint Erişimi

```bash
curl -X GET http://localhost:3001/user/session \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ MongoDB Schema

### Users Collection

```javascript
{
  "_id": ObjectId,
  "userID": 100001,           // Auto-increment ID
  "name": "Ali Veli",
  "email": "ali@example.com",
  "password": "$2a$14$...",    // Bcrypt hash
  "username": "aliveli",
  "firstname": "Ali",
  "lastname": "Veli",
  "role": "MEMBER",           // MEMBER, ADMIN, etc.
  "age": 25,
  "image": "",
  "createdAt": "2024-01-15 10:30:00",
  "updatedAt": "2024-01-15 10:30:00"
}
```

### Sessions Collection

```javascript
{
  "_id": ObjectId,
  "userID": 100001,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": ISODate("2024-01-18T10:30:00Z"),
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "deviceType": "desktop"     // desktop, mobile, tablet
}
```

## 🌐 Environment Variables

`.env` dosyası oluştur:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/authdb

# JWT Secret (güçlü bir key kullan!)
JWT_SECRET=your-super-secret-key-here-minimum-32-chars

# Server
PORT=3001

# Frontend URLs (CORS için)
FRONTEND_URL=http://localhost:3000
```

## 🛡️ Güvenlik Özellikleri

- **Password Security**: bcrypt ile 14 round hashing
- **JWT Tokens**: 72 saatlik expiration
- **Session Tracking**: IP ve cihaz bazlı takip
- **CORS Protection**: Sadece tanımlı origin'lere izin
- **Auto Cleanup**: Expired session'ları otomatik silme
- **Multi-Device**: Aynı kullanıcı birden fazla cihazda login olabilir
- **Secure Headers**: Authorization header validation

## 📊 Session Management

### Özellikler:

- ✅ **Multi-device login** desteği
- ✅ **Automatic cleanup** (expired sessions)
- ✅ **Device detection** (mobile/tablet/desktop)
- ✅ **IP tracking** & audit logging
- ✅ **Logout from all devices** özelliği
- ✅ **Active sessions** listeleme

### Session Lifecycle:

1. **Login** → Yeni session oluştur
2. **API Call** → Session & JWT validate et
3. **Logout** → Session'ı sil
4. **Auto Cleanup** → Expired session'ları temizle

## 🎨 Frontend Tech Stack

- **⚡ Next.js 15** (App Router, Turbopack)
- **📝 TypeScript 5** (Type safety)
- **🎨 Tailwind CSS 4** (Utility-first styling)
- **🌙 Theme System** (Dark/Light mode)
- **📱 Responsive Design** (Mobile-first)
- **🔄 Animations** (AOS, Lottie, Typewriter)
- **📊 Analytics** (Vercel Analytics)

## 📦 Backend Dependencies

```go
// Core
github.com/gorilla/mux      // HTTP router
go.mongodb.org/mongo-driver // MongoDB driver

// Security
github.com/golang-jwt/jwt/v5 // JWT tokens
golang.org/x/crypto         // Password hashing

// Utils
github.com/joho/godotenv    // Environment variables
```

## 🔄 Development Workflow

```bash
# Development modunda çalıştır
docker-compose up

# Sadece backend'i rebuild et
docker-compose up --build backend

# Logları takip et
docker-compose logs -f

# Temizlik
docker-compose down
docker system prune -f
```

## 🚦 API Status Codes

| Code  | Açıklama                         |
| ----- | -------------------------------- |
| `200` | ✅ Başarılı                      |
| `201` | ✅ Oluşturuldu                   |
| `400` | ❌ Geçersiz istek                |
| `401` | ❌ Yetkisiz erişim               |
| `403` | ❌ Yasaklanmış                   |
| `404` | ❌ Bulunamadı                    |
| `409` | ❌ Çakışma (email zaten kayıtlı) |
| `500` | ❌ Sunucu hatası                 |

## 📈 Performance & Monitoring

### Database Indexing

```javascript
// Otomatik oluşturulan indexler:
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ userID: 1 }, { unique: true });
db.sessions.createIndex({ token: 1 }, { unique: true });
db.sessions.createIndex({ userID: 1, expiresAt: 1 });
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### Background Jobs

- **Session Cleanup**: Her saat expired session'ları temizler
- **Health Monitoring**: MongoDB bağlantısını kontrol eder

## 🤝 Contributing

1. Repository'yi fork et
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit'le (`git commit -m 'Add amazing feature'`)
4. Branch'e push et (`git push origin feature/amazing-feature`)
5. Pull Request oluştur

## 📝 License

Bu proje MIT License altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👥 Authors & Contributors

<div align="center">

### 👨‍💻 **Developer**

<img src="https://avatars.githubusercontent.com/bymayfe" width="100" height="100" style="border-radius: 50%;" alt="bymayfe">

**[Seyfettin Budak (bymayfe)](https://github.com/bymayfe)**

_Full-Stack Developer & Project Creator_

[![GitHub](https://img.shields.io/badge/GitHub-bymayfe-181717?style=for-the-badge&logo=github)](https://github.com/bymayfe)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Seyfettin_Budak-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/seyfettin-budak-530a37333/)
[![Discord](https://img.shields.io/badge/Discord-Personal-5865F2?style=for-the-badge&logo=discord)](https://discord.com/users/402047297963294730)

**Tech Stack:** Go • Next.js • TypeScript • MongoDB • Docker

</div>

---

## 🌐 **Community & Support**

<div align="center">

**💬 Join Our Discord Community**

[![Discord Server](https://img.shields.io/discord/732620018998837418?style=for-the-badge&logo=discord&logoColor=white&label=Discord&labelColor=5865F2&color=7289DA)](https://tinyurl.com/mayfediscord-guild)

_Get help, share your projects, and connect with developers_

</div>

### 🤝 **Contributing**

Bu proje açık kaynak kod topluluğu katkıları ile büyümektedir. Katkıda bulunmak istiyorsanız:

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### 📝 **Code of Conduct**

Bu projede [Contributor Covenant](https://www.contributor-covenant.org/) davranış kurallarını benimser.

## 🎯 Roadmap

<div align="center">

![Roadmap](https://img.shields.io/badge/Development-Roadmap-purple?style=for-the-badge&logo=github-actions&logoColor=white)

</div>

### 🚧 **Yakın Zamanda (Q1 2025)**

- [x] JWT tabanlı kimlik doğrulama (72 saatlik token süresi)
- [x] Session management (multi-device support)
- [x] Tailwind CSS v4 entegrasyonu (global theme + animation pipeline)
- [x] Next.js 15 geçişi (App Router + Turbopack)
- [x] MongoDB Atlas bağlantısı (native driver + indexing)
- [x] Go backend mimarisi (JWT/context/middleware ile)

### 🎯 **Orta Vadeli (Q2 2025)**

- [ ] **Admin Panel** (user management dashboard)
- [ ] **Multi-language** support (i18n implementation)
- [ ] **Real-time Notifications** (WebSocket integration)
- [ ] **API Rate Limiting** middleware

### 🚀 **Uzun Vadeli (Q3-Q4 2025)**

- [ ] **Swagger Documentation** (OpenAPI 3.0)
- [ ] **Unit Tests** (Go & TypeScript)
- [ ] **E2E Testing** (Playwright/Cypress)
- [ ] **Performance Monitoring** (logging, metrics)
- [ ] **Microservices Architecture** (service splitting)
- [ ] **CI/CD Pipeline** (GitHub Actions)

---

<div align="center">

### ⭐ Bu proje hoşuna gittiyse star vermeyi unutma! ⭐

![Stars](https://img.shields.io/github/stars/bymayfe/multilang_web?style=social)
![Forks](https://img.shields.io/github/forks/bymayfe/multilang_web?style=social)
![Issues](https://img.shields.io/github/issues/bymayfe/multilang_web?style=social)

**Made with ❤️ by [bymayfe (Seyfettin Budak)](https://github.com/bymayfe)**

</div>
