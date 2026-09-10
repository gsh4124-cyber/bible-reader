# PROJECT STATUS — bible-reader

- 마지막 갱신: 2026-09-10
- 저장소 역할: 성경 읽기 웹서비스의 실제 코드·배포·기술상태 원본
- 상위 사업상태: 황제 Vault `직장/바이브코딩/_INDEX.md`, `직장/바이브코딩/페이지형/_INDEX.md`, `직장/바이브코딩/운영본부_상태.json`
- 표준 로컬 경로: `C:/Users/gsh41/Desktop/황제/직장/바이브코딩/페이지형/bible-reader`
- 운영 주소: https://bible-reader-1iz.pages.dev/

## 현재 단계

**PUBLIC CLOUDFLARE PRODUCTION / 9 UI LANGUAGES / PRODUCTION QA ACTIVE / CLEAN PAGE-VIEW OBSERVATION / SEARCH DISTRIBUTION OBSERVATION / ADSENSE_REVIEW_SUBMITTED**

현재 바이브코딩 Portfolio Mode는 `WAITING_EXTERNAL`이다. 실제 기술 FAIL이나 의미 있는 외부 신호 없이 새 기능개발·실기기 Gate·깊은 QA를 반복하지 않는다.

> 구현 완료 ≠ 자동 QA PASS ≠ 배포 성공 ≠ 실제 브라우저 PASS ≠ 실제 외부사용 ≠ 검색노출 ≠ 수익

## 핵심 목적

> **PC에서 실제로 편하게 읽을 수 있는 성경 페이지를 만든다.**

기능 수보다 장시간 읽기 편안함, 빠른 위치 이동, 역본 비교, 기록 회수, 실제 사용 피드백을 우선한다.

## 지원 UI 언어 / URL

- ko: `/`
- en: `/en/`
- fr: `/fr/`
- de: `/de/`
- zh: `/zh/`
- ru: `/ru/`
- la: `/la/`
- pt: `/pt/`
- ar: `/ar/`

IP 강제 리다이렉트는 사용하지 않는다.

## UI 언어와 역본 언어

UI 언어와 선택 역본 언어를 분리한다. 사용자가 역본을 바꾸면 페이지 UI 언어는 유지하고 Scripture 영역만 해당 역본 언어를 따른다. UI 언어 변경은 고정 언어 URL로 이동하며 해당 언어 기본 역본으로 전환한다.

현재 주요 역본:
`개역한글 1961 / KJV / WEB / ASV / Louis Segond 1910 / Lutherbibel 1912 / CUV / Russian Synodal / Vulgata / Almeida 1819 / Smith–Van Dyck`

실행선에는 공개도메인 또는 재배포 가능성이 확인된 역본만 둔다. 현대 한국어 역본은 권리자 허가 없이 포함하지 않는다.

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

구약/신약/전체 선택기는 제거 완료했으며 숨김 runtime으로 되살리지 않는다. 난하주·관주는 현재 runtime에서 제외한다.

## 개인정보·telemetry

개인 읽기기록은 `localStorage only`다. 로그인/계정/개인 기록 서버 동기화는 없다.

광고·유입 판단용 익명 page view만 날짜별 aggregate로 수집한다. 사용자 ID·세션 ID·IP·검색어·읽은 성구·하이라이트·메모를 저장하지 않는다.

과거 Production Browser QA가 실제 page-view에 섞이는 문제가 확인돼 자동 QA analytics 제외처리를 배포했다. **2026-09-09 이후를 clean baseline**으로 사용하고 이전 집계를 외부 사용자 수요로 역산하지 않는다.

운영 snapshot은 황제 Vault `직장/바이브코딩/페이지형/bible-reader_analytics_latest.json`과 `직장/바이브코딩/제품_헬스_latest.json`이 소유한다.

## Production / SEO

현재 주 운영·검색 주소는 **Cloudflare Pages production**이다. 과거 GitHub Pages 주소를 운영·SEO 기준으로 복원하지 않는다.

9개 언어 URL의 `html lang / title / description / canonical / reciprocal hreflang / x-default / sitemap / robots`를 Cloudflare origin과 일치하게 유지한다.

자동 QA는 JavaScript 문법, 필수 runtime, Cloudflare SEO origin, 다국어 무결성, UI/역본 언어 분리, 장·절 직접입력, 복사 형식, 모바일 select 회귀, 제거된 runtime 재유입, 공개 sitemap/robots와 브라우저 동작을 검사한다.

같은 revision에 대한 충분한 CI·Production QA 증거가 있으면 시간경과만으로 재검증하지 않는다. 실제 기술상태와 최신 head는 Actions 및 황제 Vault 운영본부 상태를 우선 회수한다.

## 모바일 재발방지

과거 Android native select 회귀에서 다음을 유지한다.
- native picker 활성 중 select/option DOM 재작성 금지
- 동적 번역 walker에서 SELECT/OPTION 제외
- 장/절 visible UI는 custom 숫자 input + menu 사용
- 자동 검사 PASS만으로 실제 모바일 체감을 과장하지 않음

새 UX 변경이 없는데 과거 모바일 Human Gate를 시간경과만으로 되살리지 않는다.

## 검색 유통

Google/Naver/Bing 핵심 등록·sitemap 제출이 확인됐고 Daum은 신청 접수 뒤 관찰 단계다. IndexNow는 활성 운영한다.

제출 성공 ≠ 크롤링 ≠ 색인 ≠ 검색 노출 ≠ 실제 유입이다. 다음 판단은 실제 색인·노출·유입과 clean 사용신호를 본다.

## AdSense — 현재

**`ADSENSE_REVIEW_SUBMITTED`**

- AdSense 사이트 추가 완료
- 공식 코드 및 `ads.txt` 반영
- Production 소유확인 통과
- 검토 요청 제출 완료
- 자동 광고는 인페이지 중심
- 앵커·사이드레일·모바일 전면광고 비활성화
- `ads.txt` UI 재탐색 결과 대기

승인 완료나 광고수익 발생으로 승격하지 않는다.

## 현재 다음 Gate

1. 2026-09-09 clean baseline 이후 실제 외부 page-view 변화 관찰
2. 실제 검색 색인·노출·유입 변화 관찰
3. AdSense 심사와 `ads.txt` 재탐색 결과 관찰
4. Production/CI 실제 FAIL 발생 시 원인분리 후 최소복구
5. 모바일·원어민·장기 저장 회귀 검증은 다음 판단을 실제로 바꾸는 새 변경이나 신호가 있을 때만 연다

> **현재 제품은 기능을 계속 늘리는 단계가 아니라, 공개 운영에서 외부사용·검색·수익화 증거를 기다리는 단계다.**
