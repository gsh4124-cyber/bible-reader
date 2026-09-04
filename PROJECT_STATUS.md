# PROJECT STATUS — bible-reader

- 마지막 갱신: 2026-09-04
- 저장소 역할: 성경 읽기 웹서비스의 실제 코드·배포·기술상태 원본
- 상위 사업상태: 황제 Vault `직장/바이브코딩/_INDEX.md` 및 `직장/바이브코딩/페이지형/_INDEX.md`
- ChatGPT 실행창: `성경 홈페이지 본부`
- 표준 로컬 경로: `C:/Users/gsh41/Desktop/황제/직장/바이브코딩/페이지형/bible-reader`
- 운영 주소: https://gsh4124-cyber.github.io/bible-reader/

## 현재 단계

**공개 운영 / 유지보수 / 실제 사용 검증 / 검색 유통 관찰 단계**

> 구현 완료 ≠ 자동 QA PASS ≠ 배포 성공 ≠ 실제 브라우저 PASS ≠ 실제 모바일 PASS ≠ 검색·시장 성공

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

## UI 언어와 역본 언어

사용자가 역본을 직접 바꾸면 UI 언어는 유지하고 성경 본문·66권 책 이름·장/절 참조·검색·기록·복사 등 Scripture 영역만 해당 역본 언어를 따른다.

UI 언어를 바꾸면 해당 언어의 고정 URL로 이동하고 기본 역본으로 전환한다.

- ko → 개역한글 1961
- en → KJV
- fr → Louis Segond 1910
- de → Lutherbibel 1912
- zh → 和合本 CUV
- ru → Russian Synodal
- la → Vulgata
- pt → Almeida 1819
- ar → Smith–Van Dyck

그 뒤 사용자는 UI 언어를 유지한 채 다른 역본을 독립적으로 선택할 수 있다. Arabic도 페이지 셸은 LTR 위치를 유지하고 실제 아랍어 Scripture 영역만 RTL로 처리한다.

## 권리 기준

실행선에는 공개도메인 또는 재배포 가능성이 확인된 역본만 둔다. 개역개정·새번역·공동번역 등 현대 한국어 역본은 권리자 허가·라이선스 없이 포함하지 않는다.

현재 주요 역본:
`개역한글 1961 / KJV / WEB / ASV / Louis Segond 1910 / Lutherbibel 1912 / CUV / Russian Synodal / Vulgata / Almeida 1819 / Smith–Van Dyck`

## 핵심 기능

- 66권·장·절 이동 및 장·절 숫자 직접 입력
- 현재 역본 전체검색 및 성경책 직접 이동
- 이전/다음 장, 글자 크기, 본문 폭, 라이트/다크
- 한 면/양면 보기, 2역본 비교
- 절 복사·선택영역 복사
- 절 하이라이트·절 저장·장 저장
- `나의 기록`과 메모
- 기록 JSON 백업/복원
- 마지막 읽기 위치·역본·읽기 설정·기록 localStorage 저장

구약/신약/전체 선택기는 제거 완료했으며 숨김 runtime으로 남기지 않는다. 난하주·관주는 현재 runtime에서 제외한다.

## 기록·개인정보

개인 읽기기록은 `localStorage only`다. 로그인/계정/개인 기록 서버 동기화는 없다.

광고·유입 판단용 익명 page view만 날짜별 aggregate로 수집한다.
- 고유 사용자/사용자 ID/세션 ID 없음
- IP·검색어·읽은 성구·하이라이트·메모 저장 안 함
- frontend `analytics.js`
- Supabase Edge Function `bible-page-view`
- DB `bible_page_views_daily`

운영관제 snapshot은 코드 저장소에 복제하지 않고 황제 Vault:
`직장/바이브코딩/페이지형/bible-reader_analytics_latest.json`
에 둔다.

## 모바일·실기기 재발방지

과거 Android native select가 열리지만 항목 터치가 적용되지 않는 회귀가 있었다.

현재 규칙:
- native picker 활성 중 select/option DOM 재작성 금지
- 동적 번역 walker에서 SELECT/OPTION 제외
- 장/절 visible UI는 custom 숫자 input + menu 사용
- 자동 검사 PASS만으로 실제 모바일 터치 PASS라고 하지 않는다.

## SEO / 운영 호스트

현재 주 운영·검색 주소는 **GitHub Pages**다.

`https://gsh4124-cyber.github.io/bible-reader/`

9개 언어 URL에 `html lang / title / description / canonical / reciprocal hreflang / x-default / sitemap / robots`를 이 호스트와 일치하게 유지한다.

2026-09-04 전수점검에서 root와 언어별 entry 일부가 다시 `bible-reader-1iz.pages.dev`를 가리키는 host drift가 확인됐다. 확정 운영선과 충돌하므로 root + 8개 언어 entry + sitemap + robots를 GitHub Pages 기준으로 닫았다. Naver verification 최신값은 보존했다.

재발 방지:
> **운영 호스트 변경은 canonical 한 줄 교체가 아니라 인프라 전환이다.**

운영 주소 확정 → 모든 언어 canonical/hreflang → sitemap/robots → runtime base path → analytics/API origin → 배포 pipeline → 새 호스트 Production QA → 검색엔진 등록까지 범위를 닫기 전에는 SEO 신호 일부만 선행 변경하지 않는다.

제출 성공 ≠ 크롤링 ≠ 색인 ≠ 검색 노출 ≠ 실제 유입이다.

## 자동 QA

GitHub Actions `Final QA and Deploy Pages`는 JavaScript 문법, 필수 runtime, 다국어 무결성, UI/역본 언어 분리, 장·절 직접입력, 복사 형식, 모바일 select 회귀, 9개 언어 SEO entry, 제거된 runtime 재유입 등을 검사한다.

상태 표현:
- `CODE/CI PASS`
- `DEPLOY PASS`
- `BROWSER PASS`
- `MOBILE REAL-USE PASS`
- `FULL QA PASS`

실제 기기 검증 전에는 `전수검사 완료`라고 과대보고하지 않는다.

## 현재 Gate

- 실제 iPhone Safari / Android / 주요 데스크톱 브라우저의 native interaction 체감
- 장·절 이동의 실제 모바일 조작성
- 더 많은 UI 언어 × 다른 역본 조합
- 기존 저장 성구·하이라이트·메모 보존의 장기 회귀
- Search Console·IndexNow 이후 실제 언어별 색인·검색 노출·유입
- GitHub Pages 경로형 주소의 AdSense addressability

황제 확인 전 실제 광고/AdSense 도입, 새 비용·유료도구, 유료 역본 라이선스는 진행하지 않는다.

## 유지보수 우선순위

1. 실제 PC/모바일 기능 오류·레이아웃 회귀
2. 역본 언어와 UI 언어 혼합 오류
3. 외부 성경 데이터 로딩 문제
4. 배포/SEO host drift
5. localStorage/백업 복원
6. 검색엔진 실제 색인·노출·유입
7. 익명 page view
8. 번역본 권리·출처 변화

새 기능을 근거 없이 계속 붙이지 않는다.
