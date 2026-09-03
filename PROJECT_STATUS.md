# PROJECT STATUS — bible-reader

- 마지막 갱신: 2026-09-03
- 저장소 역할: 성경 읽기 웹서비스의 실제 코드·기술상태 인계 원본
- 상위 사업상 상태 원본: 황제 Vault `자동 사업운영/바이브코딩/_INDEX.md` 및 `자동 사업운영/바이브코딩/페이지형/_INDEX.md`
- ChatGPT 실행창: `성경 홈페이지 본부`
- 표준 로컬 경로: `C:/Users/gsh41/Desktop/황제/자동 사업운영/바이브코딩/페이지형/bible-reader`
- 운영 주소: https://gsh4124-cyber.github.io/bible-reader/

## 현재 단계

**공개 운영 / 유지보수 / 실제 사용 검증 / 검색 유통 관찰 단계**

구현 완료, 자동 QA 성공, 배포 성공, 실제 브라우저 확인, 실제 모바일 사용, 검색 색인·노출은 서로 다른 상태로 취급한다.

## 핵심 목적

> **PC에서 실제로 가장 편하게 읽을 수 있는 성경 페이지를 만든다.**

기능 수보다 장시간 읽기 편안함, 빠른 위치 이동, 역본 비교, 기록 회수, 실제 사용 피드백을 우선한다.

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

## 역본 / UI 언어 원칙 — 최신 확정

### 역본 변경

사용자가 역본을 직접 바꾸면 UI 언어는 유지하고 성경 영역만 해당 역본 언어를 따른다.

- 성경 본문
- 66권 책 이름
- 책 선택 목록
- 장·절 표기와 성경 참조
- 본문 장 제목
- 검색 결과의 성경 참조
- 기록의 성경 참조와 현재 표시 본문
- 복사되는 성경 참조

### UI 언어 변경

사용자가 UI 언어를 바꾸면 먼저 그 언어의 기본 역본으로 함께 전환한다.

- ko → 개역한글 1961
- en → KJV
- fr → Louis Segond 1910
- de → Lutherbibel 1912
- zh → 和合本 CUV
- ru → Russian Synodal
- la → Vulgata
- pt → Almeida 1819
- ar → Smith–Van Dyck

그 다음에는 사용자가 UI 언어를 유지한 채 다른 역본을 독립적으로 선택할 수 있다.

공개 사이트에서는 언어 변경 시 해당 언어의 고정 URL로 이동한다. 로컬 `file://` 실행에서는 `?lang=`과 `translation=` query를 사용한다.

UI 컨트롤의 물리적 위치는 언어마다 뒤집지 않는다. Arabic도 페이지 셸은 LTR 위치를 유지하고 실제 아랍어 성경 본문/비교 셀만 RTL로 표시한다.

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
- 번역본 / UI 언어 / 성경책 선택
- 장·절 숫자 직접 입력 + 숫자 목록 드롭다운
- 장·절 입력 중 현재 최대 장/절보다 큰 값은 즉시 최대값으로 표시 제한
- 성경책 직접 이동 및 본문 전체검색
- 이전/다음 장
- 글자 크기, 본문 폭, 라이트/다크 모드
- 한 면/양면 보기
- 2역본 비교
- 절 클릭 복사 및 선택 영역 복사
- 절 하이라이트
- 절 저장
- 장 저장
- `나의 기록`: 하이라이트 / 저장한 성구 / 저장한 장
- 각 기록 메모 추가·수정·삭제
- 기록 JSON 백업/복원
- 마지막 읽기 위치·역본·읽기 설정·기록 localStorage 저장

구약/신약/전체 선택기는 제거 완료했으며 숨김 runtime으로 남기지 않는다.
난하주·관주는 현재 runtime에서 제외하고 미래 참고 자산만 보존한다.

## 장·절 직접입력 — 최신

- visible input은 `type="text" + inputmode="numeric"`로 두어 기존 숫자를 지우고 여러 자리 숫자를 직접 입력할 수 있다.
- 편집 중 빈 값은 허용한다.
- 숫자가 아닌 문자는 제거한다.
- 현재 성경책의 최대 장 또는 현재 장의 최대 절을 초과하는 값은 입력 즉시 최대값으로 표시한다.
- 실제 장/절 이동과 최소값 보정, 빈 값 복구는 Enter 또는 blur에서 확정한다.
- 드롭다운 숫자 선택과 직접입력을 모두 유지한다.
- `tools/validate-number-jump.mjs`가 이 구조의 회귀조건을 자동 검사한다.

## 복사 형식 — 최신

현재 선택한 역본과 역본 언어의 성경 참조를 사용한다.

예:

```text
[개역한글] 창세기 1장 1–2절

1 태초에 하나님이 천지를 창조하시니라
2 땅이 혼돈하고 공허하며 ...

성경 읽기 웹서비스 · https://gsh4124-cyber.github.io/bible-reader/
```

- 본문 절 번호는 `1`, `2`처럼 숫자만 표시
- 제목과 본문 사이 한 줄
- 본문과 사이트 서명 사이 한 줄
- 마지막은 `현지화된 페이지 이름 · URL` 한 줄
- 페이지 이름은 현재 UI 언어로 현지화
- 성경 참조와 본문은 현재 역본 언어를 따름

## 기록 저장 원칙

개인 기록은 localStorage only다. 로그인/계정/개인 기록 서버 동기화는 없다.

기록의 핵심은 특정 번역문 스냅샷이 아니라 성구 위치다. 저장 위치는 유지하고 표시 본문은 현재 역본에서 다시 가져온다.

기존 하이라이트·저장 성구·저장 장·메모를 다국어 변경 때문에 삭제하거나 초기화하지 않는다.

## 익명 방문 집계 — 황제 승인

광고·유입 판단용 총 page view만 날짜별 aggregate로 저장한다.

- 고유 사용자/사용자 ID/세션 ID 없음
- IP·검색어·읽은 성구·하이라이트·메모 등 개인 행동 데이터 저장 안 함
- 같은 사람이 여러 번 열면 각각 page view로 집계
- frontend `analytics.js`
- Supabase Edge Function `bible-page-view`
- DB `bible_page_views_daily`
- 실제 GitHub Pages origin에서만 호출

## 주요 runtime

- `app.js` — 본문 로딩·역본·기본 읽기
- `extra-translations.js` — 포르투갈어/아랍어 역본
- `local-file-language.js` — 로컬 언어 전환
- `i18n.js` — 9개 UI 언어, 9×66권 성경명, UI/성경언어 분리
- `ui-language-sync.js` — 공개 언어 URL 이동, 언어별 기본 역본, UI title, 고정 LTR 셸
- `runtime-ui-i18n.js` — 동적 UI·접근성·기록 현지화
- `full-reader-loader.js` — 언어별 고정 URL에서 동일 본체 로드
- `number-jump.js` — 장/절 숫자 입력, 입력 중 최대값 제한, 숫자 드롭다운
- `verse-picker.js` — 절 이동 상태
- `reference.js` / `book-finder.js` — 현 역본 언어 성경명 직접 이동
- `exact-search.js` — 현재 역본 전체검색
- `compare.js` — 역본 비교
- `clipboard.js` — 역본명 + 성경 참조 + 본문 + 현지화 페이지 서명 복사
- `verse-tools.js` / `records-enhancements.js` — 저장·하이라이트·장저장·기록·메모
- `analytics.js` — 익명 page view

## 모바일 회귀 방지

과거 Android native select가 열리지만 항목 터치가 적용되지 않는 회귀가 있었다.

현재 규칙:
- native picker 활성 중 select/option DOM 재작성 금지
- 동적 번역 walker에서 SELECT/OPTION 제외
- `verse-picker.js`가 장 제목 mutation으로 option을 재생성하지 않음
- 관련 정적 회귀조건을 `tools/validate-i18n.mjs`에서 검사

현재 장/절 visible UI는 custom 숫자 input + menu이고 hidden native select는 내부 상태 호환용이다.

자동 검사 PASS만으로 실제 모바일 터치 PASS라고 하지 않는다.

## SEO / 글로벌 검색 유통

9개 언어 URL에 다음을 유지한다.

- html lang
- 언어별 title / meta description
- 자기 canonical
- reciprocal hreflang
- x-default
- sitemap 9 URL
- robots sitemap directive
- Google Search Console verification meta
- IndexNow key file 및 배포 후 자동 제출

제출 성공 ≠ 크롤링 ≠ 색인 ≠ 검색 노출 ≠ 실제 유입이다.

## 자동 QA

GitHub Actions `Final QA and Deploy Pages`에서 다음을 검사한다.

- 전체 JavaScript / validator 문법
- 필수 runtime 존재
- 9개 언어 × 66권 이름 무결성
- UI locale 필수 키
- 성경명/참조/검색/기록/비교의 역본 언어 연결
- 공개 UI 언어 변경 → 현지화 URL 이동 + 언어별 기본 역본 매핑
- 로컬 언어 변경 → query 기반 이동
- Arabic 페이지 셸 비반전
- 장 제목 띄어쓰기 회귀 방지
- 장·절 직접입력: 편집 가능한 빈 상태, 숫자 필터, 입력 중 최대값 제한, Enter/blur 확정, 상태 동기화
- 복사 형식: 역본명 + 현지화 페이지 이름 + URL 한 줄 서명
- native mobile select 회귀 방지
- 9개 언어 SEO entry / hreflang / canonical / sitemap / robots / IndexNow key
- 제거한 구형 runtime 재유입 방지

## QA 상태 표현

- `CODE/CI PASS`: 문법·정적검사·자동 회귀검사 통과
- `DEPLOY PASS`: GitHub Pages Actions 배포 성공
- `BROWSER PASS`: 실제 브라우저 기능 확인
- `MOBILE REAL-USE PASS`: 실제 모바일 터치/레이아웃 확인
- `FULL QA PASS`: 요구 범위의 실제 브라우저·기기 검증까지 완료

실제 기기 검증 전에는 `전수검사 완료`라고 과대보고하지 않는다.

## 유지보수 우선순위

1. 실제 PC/모바일에서 발견되는 기능 오류·레이아웃 회귀
2. 역본 언어와 UI 언어 혼합 오류
3. 외부 성경 JSON 로딩 문제
4. GitHub Pages/IndexNow 배포 이상
5. localStorage/백업 복원
6. 검색엔진 실제 색인·노출·유입
7. 익명 page view
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
- 외부 검색엔진 계정 로그인·소유확인 작업
- 중국 본토용 별도 유료 도메인/호스팅 등 인프라 변경
- 큰 제품 방향 변경

## 현재 남은 현실검증

- 실제 PC 브라우저에서 최신 복사 형식 직접 붙여넣기 확인
- 실제 PC에서 공개 언어 전환 9개와 기본 역본 전환 확인
- 실제 PC/모바일에서 장·절 직접입력과 입력 중 최대값 제한 확인
- 실제 모바일에서 상단 컨트롤/숫자 장절 메뉴 터치 확인
- KJV/WEB/CUV/Almeida/SVD 등 복수 역본 본문 로딩 확인
- 기록/검색/비교/백업복원의 실제 상호작용 확인
- 각 검색엔진의 실제 색인·노출·유입 관찰

현재는 **코드·CI·배포 기준 안정화 후 실제 사용 검증을 계속하는 단계**다.
