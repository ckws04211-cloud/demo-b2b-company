# 한빛정밀 (포트폴리오 데모)

B2B 정밀 가공 제조기업의 국·영문 홈페이지 + 관리자 페이지 데모입니다. 실제 기업이 아닙니다.

## 사용자 페이지 (`/ko`, `/en`)
- 메인, 회사소개(CEO 인사말·연혁·인증), 사업분야, 제품 목록(카테고리 필터)·상세, 설비현황, 공지사항 목록·상세, 오시는 길, 견적 문의
- 우상단 KO / EN 전환 (next-intl, URL `/ko` `/en` 분리)
- 제품 상세 → "이 제품 견적 문의" 시 제품명 자동 선택

## 관리자 페이지 (`/admin`)
- 로그인: 아이디/비밀번호 → **2단계 인증(OTP, Google Authenticator 호환 TOTP)**
- 대시보드: 신규·처리중 문의, 최근 7일 문의, 공개 제품 수
- 견적 문의: 상태별 탭(접수/처리중/완료), 검색, 상세 보기, 상태 변경·내부 메모
- 제품 관리: 국/영문 입력, 사양 항목 추가·삭제, 이미지 선택, 공개/비공개
- 공지사항: 국/영문 작성, 상단 고정
- 보안: HMAC 서명 세션 쿠키(httpOnly), 미들웨어 + 서버 액션 이중 권한 확인, 로그인 시도 제한

### 데모 계정
- 아이디 `admin` / 비밀번호 `demo1234`
- OTP: 데모 모드에서는 로그인 화면에 현재 코드가 표시됩니다. QR을 Google Authenticator로 스캔해서 실제로 인증해 볼 수도 있습니다.

## 데이터 저장소
- 기본: **메모리 데모 저장소** (설정 없이 바로 동작, 서버 재시작 시 초기 데이터로 리셋)
- Supabase 연결 시: `supabase/schema.sql` 실행 후 환경변수 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 설정 → 자동으로 Supabase 사용

> Vercel(서버리스)에서 메모리 저장소는 인스턴스별로 따로 존재해, 데모 중 변경 사항이 잠시 뒤 사라지거나 페이지마다 다르게 보일 수 있습니다. 데이터를 유지하려면 Supabase를 연결하세요.

## 환경변수 (모두 선택)
| 이름 | 설명 | 기본값 |
| --- | --- | --- |
| `ADMIN_ID` / `ADMIN_PASSWORD` | 관리자 계정 | `admin` / `demo1234` |
| `ADMIN_TOTP_SECRET` | OTP 시크릿 (Base32) | 데모용 고정값 |
| `ADMIN_DEMO_MODE` | `false`면 로그인 화면의 계정·OTP 코드 숨김 | `true` |
| `SESSION_SECRET` | 세션 서명 키 (32자 이상) | 데모용 고정값 |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Supabase 연결 | 없음(메모리 저장소) |

실제 운영 시에는 `ADMIN_*`, `SESSION_SECRET`을 반드시 바꾸고 `ADMIN_DEMO_MODE=false`로 설정하세요.

## 실행
```bash
npm install
npm run dev     # http://localhost:3000 → /ko 로 이동
npm run build
```

## 배포 (Vercel)
GitHub에 push → Vercel에서 저장소 Import → Deploy

## 스택
Next.js 15 (App Router, Server Actions) · TypeScript · Tailwind CSS 3 · next-intl · Supabase(선택)
