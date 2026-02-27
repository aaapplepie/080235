---
name: react-dashboard
description: Build production-quality React dashboards with proper architecture, state management, data fetching, charts, and TypeScript. Extends the frontend-design skill with dashboard-specific patterns. Use when a user asks to create a dashboard, admin panel, analytics UI, or data visualization application in React.
---

# React Dashboard Builder

당신은 프로덕션 수준의 React 대시보드를 전문으로 하는 전문 React 아키텍트입니다.
`/react-dashboard`로 호출될 때 아래 워크플로우를 실행하세요.

이 스킬은 [frontend-design](frontend-design.md)의 미적 원칙을 기반으로 하며,
대시보드 특화 아키텍처와 패턴을 추가합니다.

---

## Phase 1: 프로젝트 파악

코드를 생성하기 전에 먼저 프로젝트를 탐색하세요:

1. `package.json`, `tsconfig.json`, `vite.config.*`, `next.config.*` 파일 확인
2. 설치된 의존성 파악
3. 기존 컴포넌트 디렉토리 구조 확인 (`src/components`, `src/pages`, `app/`)
4. 프레임워크 감지: Next.js App Router, Next.js Pages Router, Vite+React, CRA

사용자에게 다음을 명확히 보고하세요:
- 감지된 프레임워크와 라우터
- 기존 UI 라이브러리
- TypeScript 또는 JavaScript 여부

---

## Phase 2: 기술 스택 추천

### 기본 추천 스택

```
Vite + React + TypeScript
Tailwind CSS (스타일링)
shadcn/ui (UI 컴포넌트)
TanStack Query (서버 상태)
Zustand (클라이언트 UI 상태)
Recharts (차트)
TanStack Table (테이블)
```

### 상황별 선택

| 시나리오 | 추천 |
|---|---|
| 서버 상태만 | TanStack Query 단독 |
| 간단한 전역 상태 + 서버 상태 | TanStack Query + useState/Context |
| 복잡한 클라이언트 상태 | TanStack Query + Zustand |
| 대형 팀, Redux 경험 | RTK Query + Redux Toolkit |

### 차트 라이브러리 선택

| 차트 타입 | 추천 라이브러리 | 이유 |
|---|---|---|
| 라인, 바, 영역, 파이 | Recharts | React 네이티브, 컴포저블 |
| 복잡한 분석 | Nivo | 아름다운 기본값 |
| 대규모 데이터셋 (10만+ 포인트) | ECharts | 성능 최적화 |

---

## Phase 3: 대시보드 아키텍처

### 표준 디렉토리 구조

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx        # 루트 레이아웃 래퍼
│   │   ├── Sidebar.tsx         # 네비게이션 사이드바
│   │   └── Header.tsx          # 상단 바 + 사용자 메뉴
│   ├── dashboard/
│   │   ├── StatCard.tsx        # KPI 메트릭 카드
│   │   ├── ChartWidget.tsx     # 로딩/에러 처리된 차트 래퍼
│   │   └── DataTable.tsx       # 정렬/필터 가능한 테이블
│   └── ui/                     # shadcn/ui 또는 커스텀 프리미티브
├── hooks/
│   ├── useAuth.ts
│   └── useDashboardData.ts
├── lib/
│   ├── api.ts                  # API 클라이언트 (인터셉터 포함)
│   └── queryClient.ts          # TanStack Query 설정
├── stores/
│   └── uiStore.ts              # 사이드바, 테마 등 UI 상태
└── types/
    └── dashboard.ts            # 공유 TypeScript 인터페이스
```

### 핵심 컴포넌트 패턴

**StatCard (KPI 카드)**
```tsx
interface StatCardProps {
  label: string;
  value: number | string;
  previousValue?: number;
  unit: 'currency' | 'percentage' | 'count';
  trend: 'up' | 'down' | 'flat';
}
```

**ChartWidget (차트 래퍼)**
- 로딩 스켈레톤
- 에러 상태 (재시도 버튼 포함)
- 빈 상태 처리
- `ResponsiveContainer`로 자동 크기 조정

**DataTable (데이터 테이블)**
- TanStack Table 기반
- 정렬, 필터, 페이지네이션
- 100+ 행은 가상화 적용 (`@tanstack/react-virtual`)

---

## Phase 4: 반응형 레이아웃

CSS Grid를 사용해 대시보드 레이아웃 구성 (Flexbox가 아닌 이유: 양 축 동시 제어):

```tsx
// 대시보드 그리드
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* KPI 카드들 */}
</div>

// 앱 쉘 레이아웃
<div className="grid h-screen grid-cols-[240px_1fr] grid-rows-[60px_1fr]">
  <Sidebar className="row-span-2" />
  <Header />
  <main className="overflow-auto p-6">{children}</main>
</div>
```

---

## Phase 5: 데이터 페칭 패턴

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5분
      gcTime: 10 * 60 * 1000,     // 10분
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 쿼리 키 팩토리 패턴
export const queryKeys = {
  customers: {
    all: ['customers'] as const,
    list: (filters?: CustomerFilters) => ['customers', 'list', filters] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
  },
  purchases: {
    all: ['purchases'] as const,
    list: (filters?: PurchaseFilters) => ['purchases', 'list', filters] as const,
  },
};
```

---

## Phase 6: TypeScript 인터페이스

```typescript
// types/dashboard.ts
export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  unit: 'currency' | 'percentage' | 'count';
  trend: 'up' | 'down' | 'flat';
  changePercent?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  joinedAt: string;      // ISO 날짜 문자열
  totalPurchases: number;
  totalAmount: number;
  status: 'active' | 'inactive' | 'vip';
}

export interface Purchase {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  product: string;
  amount: number;
  date: string;          // ISO 날짜 문자열
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
}
```

---

## Phase 7: 미니멀 디자인 원칙

frontend-design 스킬의 원칙을 대시보드에 적용:

### 대시보드 전용 미적 가이드라인

- **색상**: 단일 accent color (slate, zinc, or stone 계열)
  - 배경: `bg-gray-50` (전체) + `bg-white` (카드)
  - 보더: `border-gray-200` (얇고 subtle)
  - 텍스트: `text-gray-900` (제목), `text-gray-500` (보조)
  - Accent: `text-slate-700` / `bg-slate-900` (액션)

- **타이포그래피**: 두 가지 폰트 사용
  - 헤더/로고: 개성 있는 폰트 (예: `Syne`, `Cabinet Grotesk`, `Archivo`)
  - 본문/데이터: 가독성 높은 폰트 (예: `JetBrains Mono` for numbers, `Figtree` for text)

- **공간**: 충분한 padding, 카드 간 일관된 gap
  - 카드 패딩: `p-6`
  - 섹션 간격: `gap-6`
  - 테이블 행: `py-3 px-4`

- **상태 표시**: Badge 컴포넌트로 상태 구분
  - active/completed: `bg-emerald-50 text-emerald-700`
  - pending: `bg-amber-50 text-amber-700`
  - inactive/cancelled: `bg-gray-100 text-gray-600`
  - vip/special: `bg-violet-50 text-violet-700`

### 피해야 할 것

- 과도한 그림자 (카드에 `shadow-xl` 금지, `shadow-sm` 또는 보더만)
- 화려한 그라데이션 (subtle한 경우만 허용)
- 너무 많은 색상 (2-3가지 이내)

---

## Phase 8: 성능 최적화

적용 순서:

1. **코드 스플리팅**: `React.lazy()` + `Suspense` (라우트 레벨)
2. **메모이제이션**: 필터링/정렬된 데이터에 `useMemo`, 순수 컴포넌트에 `memo`
3. **가상화**: 100+ 행 테이블에 `@tanstack/react-virtual`
4. **번들 분석**: `npx vite-bundle-visualizer`

**안티패턴 주의**:
- 모든 컴포넌트에 `memo` 적용 금지 (프로파일 먼저)
- 모든 핸들러에 `useCallback` 금지 (메모이제이션된 자식에게 전달할 때만)
- 서버 상태를 Zustand/Redux에 넣지 말 것 (TanStack Query 사용)

---

## 실행 완료 후 요약

구현 완료 시 반드시 다음을 요약하세요:
- 생성 또는 수정된 파일 목록
- 설치할 의존성 (`npm install` 명령어 포함)
- 환경 변수 목록 (필요한 경우)
- 다음 단계 권장사항
