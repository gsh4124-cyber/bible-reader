# PROJECT STATUS — bible-reader

- 마지막 갱신: 2026-09-03
- 저장소 역할: 성경 읽기 웹도구의 코드·기술상태·현재 상태 인계 원본
- 상위 상태 원본: 황제 Vault `자동 사업운영/바이브코딩/_INDEX.md` 및 `자동 사업운영/바이브코딩/페이지형/_INDEX.md`
- ChatGPT 실행창: `성경 홈페이지 본부`
- 표준 로컬 경로: `C:/Users/gsh41/Desktop/황제/자동 사업운영/바이브코딩/페이지형/bible-reader`
- 운영 주소: https://gsh4124-cyber.github.io/bible-reader/

## 현재 단계

**최종 기준본 / 9개 UI 언어 통합 / GitHub Pages 공개 운영 / 익명 방문 집계 / 글로벌 검색 유통 자동화 / 실사용·색인·유지보수 단계**

구현 완료, 자동 QA 성공, 공개 배포 성공, 실제 기기 사용 PASS, 검색 색인·노출은 서로 구분한다.

## 핵심 목적

> **PC에서 실제로 가장 편하게 읽을 수 있는 성경 페이지를 만든다.**

기능 수보다 장시간 읽기 편안함, 빠른 위치 이동, 역본 비교, 기록 회수, 실제 사용 피드백을 우선한다.

## 가장 중요한 다국어 원칙 — 황제 확정

한국어 본체와 별도 해외 미니앱을 운영하지 않는다. 모든 언어 URL은 동일한 실제 성경 리더 본체를 사용한다.

### 1. 역본 변경 = 성경 영역만 변경

역본을 바꾸면 다음이 **선택한 역본의 언어**를 따른다.

- 성경 본문
- 66권 책 이름
- 책 선택 목록
- 장·절 표기
- 본문 장 제목
- 성경 검색 결과의 성경 참조
- 저장 성구·하이라이트·저장 장의 성경 참조 및 현재 표시 본문
- 복사되는 성경 참조

예:
- 한국어 UI + KJV → `Numbers 1`, 영어 본문
- 한국어 UI + WEB → `Philippians 1`, 영어 본문
- 한국어 UI + CUV → `民数记 第1章`, 중국어 본문
- 한국어 UI + 개역한글 → `민수기 1장`, 한국어 본문

### 2. 언어 변경 = 성경을 제외한 UI만 변경

언어를 바꾸면 현재 역본은 유지하고 다음 **서비스 UI**만 선택한 UI 언어를 따른다.

- 검색 / 비교
- 이전 / 다음
- 한 면 / 양면 보기
- 글자 크기 / 폭 / 테마
- 메모장 / 나의 기록
- 기록 백업 / 복원
- 메모 추가·수정·삭제
- 저장·하이라이트 조작 버튼
- 로딩·오류·확인 문구
- 접근성 aria-label/title
- 브라우저 title / meta description 등 UI·검색 진입 문구

따라서 `KJV + 한국어 UI`에서 본문과 성경명은 영어이고 `비교`, `메모장`, `나의 기록` 등 조작 UI는 한국어가 정상이다.

UI 언어와 역본을 서로 강제로 동기화하지 않는다.

## 지원 UI 언어 / URL

- ko: `/bible-reader/`
- en: `/bible-reader/en/`
- fr: `/bible-reader/fr/`
- de: `/bible-reader/de/`
- zh: `/bible-reader/zh/`
- ru: `/bible-reader/ru/`
- la: `/bible-reader/la/`
- pt: `/bible-reader/pt/`
- ar: `/bible-reader/ar/`

IP 강제 리다이렉트는 사용하지 않는다.

## 현재 역본

권리 안전성이 확인된 공개도메인·재배포 가능 자료만 실행선에 둔다.

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

## 핵심 기능

- 66권·장·절 이동
- 성경책 직접 이동 및 본문 전체검색
- 이전/다음 장
- 글자 크기, 본문 폭, 라이트/다크 모드
- 한 면/양면 보기
- 2역본 비교
- 절 복사
- 절 하이라이트
- 절 저장
- 장 저장
- `나의 기록`: 하이라이트 / 저장한 성구 / 저장한 장
- 각 기록 메모 추가·수정·삭제
- 기록 JSON 백업/복원
- 마지막 읽기 위치·역본·읽기 설정·기록 localStorage 저장

구약/신약/전체 선택기는 제거 완료했으며 숨김 코드로 남기지 않는다.

난하주·관주는 현재 MVP runtime에서 제외한다. 관련 annotation 스키마/수입 자산은 미래 참고용으로만 보존한다.

## 기록 저장 원칙

개인 기록은 localStorage only다. 로그인/계정/개인 기록 서버 동기화는 없다.

기록의 핵심은 특정 번역문 스냅샷이 아니라 성구 위치다. 저장 위치는 유지하고 표시 본문은 현재 보고 있는 역본에서 다시 가져온다.

기존 하이라이트·저장 성구·저장 장·메모를 다국어 작업 때문에 삭제하거나 초기화하지 않는다.

## 익명 방문 집계 — 황제 승인

광고·유입 판단용 총 page view만 날짜별 aggregate로 저장한다.

- 고유 사용자/사용자 ID/세션 ID 없음
- IP·검색어·읽은 성구·하이라이트·메모 등 개인 행동 데이터 저장 안 함
- 같은 사람이 여러 번 열면 각각 page view로 집계
- frontend `analytics.js`
- Supabase Edge Function `bible-page-view`
- DB `bible_page_views_daily`
- 로컬 실행은 집계하지 않고 실제 GitHub Pages origin에서만 호출

## 현재 다국어 runtime

- `app.js` — 본문 로딩·역본·기본 읽기·검색 기반
- `extra-translations.js` — 포르투갈어/아랍어 역본 및 선택 유지
- `i18n.js` — 9개 UI 언어, 9×66권 성경명, UI/성경언어 분리 원본
- `runtime-ui-i18n.js` — 동적 UI·접근성·기록·브라우저 제목 보완
- `i18n-layout.css` — PC/태블릿/모바일 다국어 레이아웃·Arabic RTL
- `full-reader-loader.js` — 언어별 고정 URL에서 동일 본체 로드
- `book-finder.js` / `reference.js` — 현 역본 언어의 성경명 검색·직접 이동
- `exact-search.js` — 현재 역본 전체검색
- `compare.js` — 비교
- `verse-picker.js` — 절 이동; 모바일 native select가 열린 동안 option 재생성 금지
- `clipboard.js` — 현 역본 언어 기준 성경 참조 복사
- `verse-tools.js` / `records-enhancements.js` — 저장·하이라이트·장저장·기록·메모
- `analytics.js` — 익명 page view

제거한 구형/중복 runtime은 다시 연결하지 않는다.

## 모바일 native select 재발 방지

실제 Android에서 선택창은 열리지만 항목 터치가 적용되지 않는 회귀가 발생한 적이 있다.

원인:
- MutationObserver/현지화 코드가 native picker가 열린 동안 `<select>/<option>`을 다시 쓰거나 재생성함

현재 규칙:
- picker 활성 중 option DOM 재작성 금지
- 동적 번역 walker에서 SELECT/OPTION 제외
- `verse-picker.js`가 장 제목 mutation으로 절 select를 재생성하지 않음
- 관련 회귀조건을 `tools/validate-i18n.mjs`에서 검사

자동 검사 PASS만으로 실제 모바일 터치 PASS라고 하지 않는다.

## SEO / 글로벌 검색 유통

각 9개 언어 URL에 다음을 유지한다.

- html lang
- Arabic dir=rtl
- 언어별 title / meta description
- 자기 canonical
- reciprocal hreflang
- x-default
- sitemap 9 URL
- robots sitemap directive

Google Search Console HTML 소유확인 태그는 유지한다.

### IndexNow

2026-09-03부터 GitHub Pages 배포 후 IndexNow 자동 제출을 연결했다.

- 9개 언어 진입 URL 제출
- 검증 키 파일: `193977ee04feba4a99f471a555a2aa54.txt`
- 첫 실제 제출 run `33657942702`
- `notify-indexnow` job success
- HTTP `202 Accepted`, 9 URLs submitted
- 문서/워크플로 전용 변경은 중복 제출하지 않음

세부 검색생태계 상태 원본: `GLOBAL_SEARCH_DISTRIBUTION.md`

현재 구분:
- Google: Search Console 소유확인 완료, 실제 각 언어 색인·노출은 관찰 대상
- Bing: sitemap + IndexNow 활성, Webmaster 상세 등록은 필요 시 로그인 Gate
- Naver: IndexNow 경로 활성, Search Advisor 상세 등록은 필요 시 로그인 Gate
- Yandex: sitemap + IndexNow 활성, Webmaster 등록은 로그인 Gate
- Baidu: zh URL/sitemap/robots 준비, 별도 Search Resource Platform 등록 및 중국 본토 접근성 검증은 Gate/현실검증

제출 성공 ≠ 크롤링 ≠ 색인 ≠ 검색 노출 ≠ 실제 유입이다.

## QA 상태 구분

다음 표현을 엄격히 구분한다.

- `CODE/CI PASS`: 문법·정적검사·자동 회귀검사 통과
- `DEPLOY PASS`: GitHub Pages Actions 배포 성공
- `BROWSER PASS`: 실제 브라우저 기능 확인
- `MOBILE REAL-USE PASS`: 실제 모바일 터치/레이아웃 확인
- `FULL QA PASS`: 요구 범위의 실제 브라우저·기기 검증까지 완료

실제 기기 검증 전에는 `전수검사 완료`라고 과대보고하지 않는다. 세부 규칙은 `QA_REAL_DEVICE_RULES.md` 참고.

## 현재 자동 QA

GitHub Actions `Final QA and Deploy Pages`에서 최소 다음을 검사한다.

- 전체 JS 문법
- 필수 runtime 존재
- 9개 언어 × 66권 이름 배열 무결성
- UI locale 필수 키
- 현 역본 언어를 성경명/복사/검색에 사용하는 연결
- 기록 본문이 현재 역본에서 로드되는 구조
- native mobile select 회귀 방지
- 언어 URL html lang/canonical/description/hreflang
- sitemap/robots/IndexNow 키 파일
- 제거한 구형 runtime/구약신약/daily/focus 재유입 방지

## 유지보수 우선순위

1. 실제 PC/모바일에서 발견되는 기능 오류·레이아웃 회귀
2. 역본 언어와 UI 언어 혼합 오류
3. 외부 성경 JSON 로딩 문제
4. GitHub Pages/IndexNow 배포 이상
5. 검색엔진 실제 색인·노출·유입
6. 익명 page view
7. localStorage/백업 복원
8. 번역본 권리·출처 변화

새 기능을 근거 없이 계속 붙이지 않는다.

## Gate

황제 확인 전 진행하지 않는다.

- 실제 광고/AdSense 도입
- 새 비용·유료도구
- 유료 번역본 라이선스
- 외부 권리자 연락
- 로그인/개인 기록 서버 DB/개인정보 저장
- page view 합계를 넘어서는 개인 식별·세션·읽기행동 추적
- Search Console/Bing/Yandex/Baidu 등 외부 계정 로그인·소유확인 작업
- 중국 본토용 별도 유료 도메인/호스팅 등 인프라 변경
- 큰 제품 방향 변경

## 현재 남은 현실검증

- 실제 삼성/Android에서 역본·언어·책·장·절 native select 터치 확인
- 실제 모바일에서 상단 3줄 구조와 장/절 겹침 재확인
- KJV/WEB/CUV 등 복수 역본에서 성경명과 본문 언어 일치 확인
- UI 언어 변경 시 역본이 유지되고 UI만 변경되는지 확인
- 기록/검색/비교의 실제 모바일 상호작용 확인
- 각 검색엔진의 실제 색인·노출·유입 관찰

현재는 **유지보수 + 실제 사용 검증 + 검색 유통 관찰 단계**다.
