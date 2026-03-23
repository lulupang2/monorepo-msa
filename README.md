<!-- PROJECT LOGO OR BANNER HERE IF YOU HAVE ONE -->
<div align="center">
  <h1 align="center">🛒 Mall Project (with. 통합 관리자 웹)</h1>
  <p align="center">
    <strong>최신 기술 스택으로 구축된 풀스택 마이크로서비스 이커머스 애플리케이션입니다.</strong> 🚀
  </p>
</div>

---

안녕하세요! 본 리포지토리는 사용자 경험을 극대화한 이커머스 쇼핑몰과, 운영 효율을 높여주는 전용 관리자(Admin) 콘솔이 결합된 풀스택 프로젝트입니다. MSA(Microservices Architecture) 구조로 설계되어 확장성이 뛰어나며, 도커를 통해 누구나 쉽게 전체 환경을 구축할 수 있습니다. 😊

## 🚀 기술 스택 (Tech Stack)

### 🧱 Backend (API Servers)
- **Frameworks**: Spring Boot 3.x (API Order, Gateway, Display), NestJS (API Auth)
- **Database**: PostgreSQL (Drizzle ORM & Spring Data JPA)
- **Cache**: Redis (Cart & Idempotency)
- **Key Features**: 마이크로서비스 아키텍처, 배송지(Shipping Address) DB 관리, 멱등성(Idempotency) 보장 로직.

### 🛍️ Frontend 1: Web Mall (고객용 브랜드 쇼핑몰)
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Key Features**: 메인 홈 **스티키 헤더(Sticky Header)**, 장바구니 **실시간 수량 조절**, 배송지 선택 모달(Address List Modal).

### 🛠️ Frontend 2: Web Admin (관리자용 통합 콘솔)
- **Framework**: SvelteKit (Svelte 5)
- **Editor**: Quill (위지윅 에디터 연동)
- **Key Features**: 상품 상세 정보 리치 텍스트 관리, 실시간 배너 활성화 제어.

---

## 🏗️ 프로젝트 구조 (Monorepo)

```text
/setup
  ├── apps
  │   ├── api-auth/      # NestJS 인증 서버 (포트: 18000)
  │   ├── api-order/     # Spring Boot 주문/결제 서버 (포트: 18080)
  │   ├── gateway/       # Spring Cloud Gateway (포트: 18001)
  │   ├── web-mall/      # Next.js 쇼핑몰 (포트: 13001)
  │   └── web-admin/     # SvelteKit 어드민 (포트: 13002)
  └── docker-compose.all.yml # 전체 시스템 일괄 배포 설정
```

---

## 🚀 배포 및 실행 가이드 (Deployment)

### 🐳 도커를 이용한 일괄 실행 (Recommended)
모든 마이크로서비스와 인프라를 한 번에 빌드하고 실행합니다.
```bash
docker-compose -f docker-compose.all.yml up --build -d
```
*성공 시 각 서비스가 지정된 포트에서 즉시 구동됩니다.*

### 🛠️ 로컬 개발 환경 실행
1. **의존성 설치**: `pnpm install`
2. **전체 구동**: `pnpm dev` (Turbo 기반 통합 실행)

---

## ✨ 주요 구현 하이라이트

- **배송지 관리 & 주문 연동**: DB 기반의 주소록 시스템을 구축하여 결제 시 "기본 배송지로 저장" 기능을 제공합니다. 주문 시점의 주소 데이터를 스냅샷 형태로 보존하여 데이터 정합성을 유지합니다. 🏠🗄️
- **UX 인터랙션 최적화**: 메인 페이지 스티키 헤더, 장바구니 내 실시간 수량 조절, 독립적인 주소 검색 모달 등 사용자 편의성을 고려한 UI/UX를 구현했습니다. ✨
- **강력한 멱등성 보장**: Redis와 `Idempotency-Key`를 결합하여 중복 결제 및 중복 요청을 원천 차단합니다. 🛡️

---

## 📝 TO-DO (향후 과제)

- [ ] **실결제 연동**: Portone(아임포트) 등 실제 PG사와 결제 API 연동.
- [ ] **어드민 에디터 고도화**: 이미지 서버(S3) 연동 및 에디터 기능 확장.
- [ ] **알림 서비스**: 주문/배송 상태 변경 시 알림톡/메일 발송 기능.
- [ ] **검색 시스템**: 엘라스틱서치(Elasticsearch) 도입을 통한 상품 검색 고도화.

---

설치 또는 실행 과정에서 궁금한 점이 있으시다면 언제든 편하게 이슈를 남겨주세요! 감사합니다. 💻🙌
