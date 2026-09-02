# PROJECT STATUS — bible-reader

- 마지막 갱신: 2026-09-02
- 저장소 역할: 성경 읽기 웹도구의 코드·기술상태·현재 상태 인계 원본
- 상위 상태 원본: 황제 Vault `자동 사업운영/바이브코딩/_INDEX.md`
- ChatGPT 실행창: `성경 홈페이지 본부`
- 표준 로컬 경로: `C:/Users/gsh41/Desktop/황제/자동 사업운영/바이브코딩/페이지형/bible-reader`
- 운영 주소: https://gsh4124-cyber.github.io/bible-reader/

## 현재 단계 — 2026-09-02

**최종 기준본 + 9개 언어 다국어 통합 완료 / GitHub Pages 공개 배포 / 실사용·검색노출·유지보수 단계**

새 기능을 근거 없이 계속 붙이지 않는다. 실제 사용 중 발견되는 오류·불편, 검색노출 문제, 외부 데이터 로딩 문제, 브라우저 회귀처럼 실제 근거가 생긴 경우만 수정한다.

## 핵심 목적

> **PC에서 실제로 가장 편하게 읽을 수 있는 성경 페이지를 만든다.**

기능 수보다 장시간 읽기 편안함, 빠른 위치 이동, 역본 비교, 기록 회수, 실제 사용 피드백을 우선한다.

## 다국어 운영 원칙 — 황제 확정

한국어 본체와 별도 해외 미니앱을 운영하지 않는다.

> **동일한 실제 성경 리더 본체를 모든 언어에서 사용하고, UI 언어·기본 역본·검색 진입 URL만 현지화한다.**

지원 UI 언어와 진입 URL:
- 한국어: `/bible-reader/`
- English: `/bible-reader/en/`
- Français: `/bible-reader/fr/`
- Deutsch: `/bible-reader/de/`
- 中文: `/bible-reader/zh/`
- Русский: `/bible-reader/ru/`
- Latina: `/bible-reader/la/`
- Português: `/bible-reader/pt/`
- العربية: `/bible-reader/ar/`

IP 기반 강제 리다이렉트는 사용하지 않는다.

### 언어와 역본 분리

- UI 언어와 성경 역본은 별도 상태다.
- 언어를 바꾸면 해당 언어 URL로 이동하고 그 언어의 기본 역본을 선택한다.
- 역본을 사용자가 바꾸면 현재 UI 언어는 유지한다.
- 예: English UI에서 KJV → WEB → ASV로 바꿔도 UI는 English 그대로다.
- 현재 선택 역본은 localStorage에 유지한다.

언어별 기본 역본:
- ko → 개역한글 1961
- en → KJV
- fr → Louis Segond 1910
- de → Lutherbibel 1912
- zh → 和合本 CUV
- ru → Синодальный перевод
- la → Vulgata
- pt → Almeida 1819
- ar → Smith–Van Dyck

## 다국어 구현 상태

### 66권 이름

`i18n.js`에 9개 언어 각각 66권 전체 명칭을 둔다.

책 이름이 나오는 책 선택, 장 제목, 검색 결과/참조, 저장 기록, 복사 참조는 현재 UI 언어의 명칭을 사용한다. 중국어 CUV에서 `Numbers 第1章`처럼 영어 책 이름이 섞이지 않고 `民数记 第1章`처럼 표시하도록 정리했다.

### UI 현지화

현지화 대상:
- 역본/언어/구약·신약/책/장/절/검색
- 비교, 한 면/양면 보기
- 이전/다음
- 글자 크기 및 읽기 폭
- 기록 패널 전체
- 메모 편집기·삭제·백업/복원
- 검색 진행/결과 요약
- 로딩/오류
- 하단 역본·권리 안내
- 광고 라벨
- aria-label/title 등 접근성 문구
- 복사 참조

글자 크기 표기:
- 한국어 `가− / 가+`
- 중국어 `字− / 字+`
- 러시아어 `А− / А+`
- 아랍어 `ع− / ع+`
- 영어·프랑스어·독일어·포르투갈어·라틴어 `A− / A+`
- 읽기 폭은 공통 `↔`

`i18n-layout.css`가 언어별 문자열 길이에 따른 PC/태블릿/모바일 topbar 줄바꿈과 Arabic RTL을 처리한다. PC는 가능한 한 한 줄 사용성을 우선하되 공간이 부족하면 자연스럽게 줄바꿈한다.

### 기록과 역본

기존 하이라이트·저장 성구·저장 장·메모를 초기화하거나 삭제하지 않는다.

기록의 핵심은 성구 위치다. 기록 목록의 본문은 현재 보고 있는 역본을 다시 불러온다.

예:
- 민수기 1:1 위치를 과거 개역한글에서 저장
- 현재 KJV → 현재 KJV 본문으로 표시
- 현재 CUV → 현재 CUV 본문으로 표시
- 다시 개역한글 → 개역한글 본문으로 표시

개인 기록 자체는 계속 localStorage only다.

## 현재 다국어 runtime 구조

핵심:
- `i18n.js` — 9개 언어 UI/66권 이름/언어 선택/동적 기본 현지화의 원본
- `i18n-layout.css` — 다국어 상단 레이아웃·모바일·RTL
- `runtime-ui-i18n.js` — 기존 동적 기능이 생성하는 UI/접근성 문구의 호환 현지화
- `full-reader-loader.js` — 각 언어 URL에서 동일한 본체를 로드하고 UI 언어·SEO·기본 역본을 부팅
- `extra-translations.js` — 포르투갈어/아랍어 역본 추가 및 역본 선택 유지
- `clipboard.js` — 현재 언어의 책 이름과 참조 형식으로 복사

중복·구형 다국어 실행선은 제거했다:
- `locale-safe.js`
- `language-selector.js`
- `launch-translation.js`

기존 `locale.js`, `daily.js`, `focus-mode.js`, `notebook-tabs-fix.css`도 runtime에서 제거된 상태를 유지한다.

## SEO 구조

각 9개 언어 URL에 다음을 유지한다.
- `html lang`
- Arabic `dir="rtl"`
- 언어별 title
- 언어별 meta description
- 자기 canonical
- 9개 언어 reciprocal hreflang
- `x-default`

`sitemap.xml`에 9개 URL을 모두 포함한다.

Google Search Console HTML verification tag는 루트 `<head>`에서 계속 유지한다.

## 현재 읽기 기능

- 66권·장·절 이동
- 성경책 위치 및 본문 검색
- 이전/다음 장
- 글자 크기, 본문 폭, 라이트/다크 모드
- 한 면/양면 보기
- 다국어 역본 선택 및 2역본 비교
- 절 복사
- 절 하이라이트
- 절 저장
- 장 저장
- `나의 기록`: 하이라이트 / 저장한 성구 / 저장한 장
- 각 기록 메모 추가/수정·삭제
- 기록 백업/복원(JSON)
- 마지막 읽기 위치·역본·읽기 설정·기록 localStorage
- 로그인/계정/개인 기록 서버 동기화 없음
- 실제 광고 비활성

## 번역본·권리 기준

현재 실행선은 권리 안전성이 확인된 공개도메인·재배포 가능 역본만 사용한다.

- 개역한글 1961
- KJV
- WEB
- ASV
- Louis Segond 1910
- Lutherbibel 1912
- 和合本 CUV
- Russian Synodal
- Vulgata
- Almeida 1819
- Smith–Van Dyck

개역개정·새번역·공동번역 등 현대 한국어 역본은 권리자 허가·라이선스 없이 포함하지 않는다.

난하주·관주는 신뢰 가능한 전체 원자료 확보 전까지 runtime에 넣지 않는다. 기존 annotation 스키마·수입 도구는 미래 자산으로만 보존한다.

## 다국어 QA — 2026-09-02

GitHub Actions `Final QA and Deploy Pages`에서 다음을 자동 검수한다.

- 전체 JS 문법
- 필수 runtime 존재
- 9개 언어 × 66권 이름 배열 무결성
- 9개 언어 UI locale 존재
- 각 언어 URL의 html lang / canonical / description / hreflang
- sitemap 9개 URL
- 구형/중복 runtime이 index에서 제외됐는지
- annotation runtime이 MVP에서 제외됐는지

`tools/validate-i18n.mjs`를 추가해 9개 언어 각각 정확히 66권인지 자동 검증한다.

최신 다국어 동적 UI 보완 커밋 `1015aab50c715d4e3b7a709dbf24d672e3700991`의 workflow run `33619548569`가 **QA success + GitHub Pages deploy success**로 완료됐다.

자동 QA와 배포 성공은 실제 브라우저 UX 검증과 구분한다. 최종 PC/모바일 시각·클릭 검증은 황제의 공개 페이지 확인을 우선한다.

## 익명 방문 집계 — 황제 승인 2026-09-02

광고·유입 판단용 총 page view만 날짜별 aggregate로 저장한다.

- 고유 사용자/사용자 ID/세션 ID 없음
- IP·검색어·읽은 성구·하이라이트·메모 등 개인 행동 데이터 저장 안 함
- 같은 사람이 여러 번 열면 각각 page view로 집계
- frontend `analytics.js`
- Supabase Edge Function `bible-page-view`
- DB `bible_page_views_daily`
- 개인 기록과 완전히 분리

## 재발 방지 규칙

1. UI를 제거·교체하면 HTML뿐 아니라 연결 JS/CSS/CI 필수파일 목록까지 함께 정리한다.
2. 다국어에서 번역문 길이가 달라도 select/button 텍스트를 잘라 기능명을 숨기지 않는다. 공간 부족 시 줄바꿈을 우선한다.
3. UI 언어와 역본은 독립 상태로 유지한다. 역본 변경으로 UI 언어가 바뀌지 않게 한다.
4. 책 이름은 영어 fallback으로 임시 처리하지 않고 지원 언어별 66권 전체 배열을 검증한다.
5. 동적 생성 UI는 정적 HTML 현지화와 별도로 검수한다.
6. 자동 QA PASS를 실제 사용 PASS로 간주하지 않는다.
7. 기존 localStorage 기록을 다국어 마이그레이션 때문에 삭제·초기화하지 않는다.
8. 원격 `main` 반영과 Windows 로컬 저장소 동기화는 별개다. 로컬 실행경로를 쓸 때는 GitHub Desktop Pull 등으로 최신화해야 한다.
9. 방문 통계는 개인 식별·행동추적으로 확대하지 않는다.

## 유지보수 기준

현재부터 우선순위:
- 실제 PC/모바일에서 발견된 다국어 레이아웃·번역 잔존 문제
- 핵심 기능 회귀
- GitHub Pages 배포 이상
- 외부 성경 JSON 로딩 문제
- Search Console 색인·검색 오류
- 익명 page view 집계
- 번역본 권리·출처 변화
- localStorage/백업 복원 문제

## Gate

황제 확인 전 진행하지 않는다.
- 실제 광고/AdSense 도입
- 새 비용·유료도구
- 유료 번역본 라이선스
- 외부 권리자 연락
- 로그인/개인 기록 서버 DB/개인정보 저장
- page view 합계를 넘어서는 개인 식별·세션·읽기행동 추적
- 큰 제품 방향 변경

## 다음 행동

**새 기능 개발 없음.**

공개 페이지에서 한국어·영어·중국어·포르투갈어·아랍어를 중심으로 실제 PC/모바일 사용을 최종 확인하고, 발견되는 실사용 오류만 유지보수한다.
