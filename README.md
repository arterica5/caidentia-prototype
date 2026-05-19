# Caidentia 2.0 — Design-to-Source Prototype

신제품(NPI) 협업을 위한 4-BOM 모델 기반 BOM Collaboration 프로토타입.

5명의 페르소나(PM/DE/CM/SM/QM)가 한 화면에서 부품 단위로 협업하는 모습을 시연합니다.

---

## 🚀 빠른 시작 (로컬 실행)

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
# → http://localhost:5173 접속

# 3. 빌드 (배포용)
npm run build
# → dist/ 폴더 생성

# 4. 빌드 결과물 미리보기
npm run preview
# → http://localhost:4173 접속
```

---

## 🌐 배포 옵션

### Option A: Vercel (가장 추천, 5분)

1. [vercel.com](https://vercel.com) 회원가입 (GitHub 계정 연동)
2. 이 프로젝트를 GitHub repository에 push
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create caidentia-prototype --public --source=. --push
   # 또는 GitHub 웹에서 repo 생성 후 push
   ```
3. Vercel 대시보드 → "Import Project" → GitHub repo 선택
4. Framework는 **Vite** 자동 감지 → "Deploy" 클릭
5. ⏱ 약 1-2분 후 `your-project.vercel.app` 도메인 발급
6. 이후 GitHub에 push할 때마다 자동 재배포 ✨

**커스텀 도메인** 사용 시: Vercel 프로젝트 Settings → Domains에서 추가

---

### Option B: GitHub Pages (완전 무료)

1. GitHub repository 생성 및 push
2. Repo Settings → **Pages** → Source를 **"GitHub Actions"**로 변경
3. 이미 포함된 `.github/workflows/deploy.yml`이 자동 실행
4. `https://<username>.github.io/caidentia-prototype/` 으로 접속

**주의**: `vite.config.js`에서 `base: './'` 설정이 GitHub Pages 호환을 위해 필요 (이미 설정됨)

---

### Option C: Netlify

1. [netlify.com](https://netlify.com) 가입 (GitHub 연동)
2. "Add new site" → "Import from Git" → repo 선택
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy 클릭

---

### Option D: Cloudflare Pages (한국에서 빠름)

1. [pages.cloudflare.com](https://pages.cloudflare.com) 가입
2. "Create a project" → GitHub repo 연결
3. Framework preset: **Vite**
4. Build command: `npm run build` / Output: `dist`
5. Deploy

---

## 📁 프로젝트 구조

```
caidentia-prototype/
├── src/
│   ├── App.jsx          ← 메인 프로토타입 (단일 파일, ~8,700줄)
│   ├── main.jsx         ← React 진입점
│   └── index.css        ← Tailwind directives
├── public/              ← 정적 자산 (현재 비어있음)
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json          ← Vercel 배포 설정
└── .github/
    └── workflows/
        └── deploy.yml   ← GitHub Pages 자동 배포
```

---

## 🎬 시연 가이드

별도 docx 파일 참조:
- `Caidentia_Demo_Guide_v2.docx` — 15-20분 전체 시연 흐름
- `Caidentia_LNB_Menu_Guide.docx` — LNB 메뉴 1-2분 설명용

### 키보드 단축키

| 단축키 | 동작 |
|---|---|
| `→` / `←` | 시나리오 step 이동 |
| `Shift + R` | 시나리오 리셋 |
| `Esc` | Chat 패널 닫기 |
| `⌘ + B` / `Ctrl + B` | LNB 사이드바 토글 |

---

## 🔧 기술 스택

- **React 18** + Hooks (Functional Components only)
- **Vite 5** (빌드)
- **Tailwind CSS 3** (스타일링)
- **lucide-react** (아이콘)

**외부 API 호출 없음** — 100% 클라이언트 측 동작, 데모 데이터 정적 정의

---

## ⚠️ 보안 / 공유 시 주의

- 실제 회사 데이터 없음 (모두 데모 데이터)
- 인증 없음 — URL 알면 누구나 접근
- 외부 API 호출 없음

공유 범위에 따라:
- **공개 시연용** → 그대로 publish 가능
- **내부용** → Vercel Password Protection (Pro plan) 또는 Cloudflare Access 같은 미들웨어 사용

---

## 📞 문의

프로토타입 관련 질문은 디자인팀으로.
