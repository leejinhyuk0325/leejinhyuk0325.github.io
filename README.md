This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Supabase 설정

깃허브 OAuth 로그인을 사용하려면 Supabase 설정이 필요합니다.

1. [Supabase](https://supabase.com)에서 프로젝트를 생성합니다.

2. **Supabase URL 및 API 키 확인**:
   - Supabase 대시보드에 로그인
   - 왼쪽 사이드바에서 **Settings** (톱니바퀴 아이콘) 클릭
   - **API** 메뉴 클릭
   - **Project URL**: `https://xxxxx.supabase.co` 형식의 URL (예: `https://abcdefghijklmnop.supabase.co`)
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 형식의 긴 문자열
   - 두 값을 복사해두세요
3. **로컬 개발 환경 설정**: 프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **GitHub Secrets 설정** (배포용):

   - GitHub 저장소로 이동
   - Settings > Secrets and variables > Actions
   - New repository secret 클릭
   - 다음 두 개의 Secret을 추가:
     - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL (예: `https://abcdefghijklmnop.supabase.co`)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
   - ⚠️ **중요**: Secret 이름이 정확히 일치해야 합니다 (대소문자 구분)
   - Secret 설정 후 `main` 브랜치에 푸시하거나 GitHub Actions에서 워크플로우를 수동 실행해야 합니다

5. **GitHub OAuth 설정**:
   - Supabase 대시보드에서 **Authentication > Providers**로 이동
   - **GitHub** Provider를 활성화
   - GitHub에서 OAuth App 생성:
     1. GitHub에 로그인 후 Settings > Developer settings > OAuth Apps로 이동
     2. "New OAuth App" 클릭
     3. Application name, Homepage URL 입력
     4. **Authorization callback URL**에 `https://your-project-ref.supabase.co/auth/v1/callback` 입력
     5. "Register application" 클릭
   - 생성된 **Client ID**와 **Client Secret**을 복사
   - Supabase의 GitHub Provider 설정에 Client ID와 Client Secret 입력
   - "Save" 클릭

### 데이터베이스 테이블

**현재는 추가 DB 테이블이 필요하지 않습니다.**

- Supabase Auth만 사용 중이며, `auth.users` 테이블은 Supabase가 자동으로 관리합니다
- 로그인 기능만 사용하는 경우 별도의 테이블 생성이 필요 없습니다

**나중에 필요할 수 있는 테이블들:**

추가 기능을 구현할 때는 다음 테이블들을 생성할 수 있습니다:

- **profiles**: 사용자 프로필 정보 (닉네임, 아바타, 소개 등)
- **posts**: 게시글 데이터
- **comments**: 댓글 데이터
- **likes**: 좋아요 데이터
- 기타 프로젝트에 필요한 테이블들

테이블 생성은 Supabase 대시보드의 **Table Editor**에서 할 수 있습니다.

### 문제 해결

**환경 변수가 설정되었는데도 placeholder URL이 사용되는 경우:**

1. **GitHub Secrets 확인**:

   - Secret 이름이 정확한지 확인 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - 값에 공백이나 줄바꿈이 없는지 확인
   - URL은 `https://`로 시작해야 합니다

2. **재배포 필요**:

   - GitHub Secrets를 설정한 후에는 반드시 재배포가 필요합니다
   - `main` 브랜치에 푸시하거나
   - GitHub Actions 탭에서 "Deploy to GitHub Pages" 워크플로우를 수동 실행

3. **빌드 로그 확인**:

   - GitHub Actions의 빌드 로그에서 환경 변수가 제대로 전달되었는지 확인
   - "Build" 단계에서 환경 변수가 설정되어 있는지 확인

4. **로컬 테스트**:
   - 로컬에서 `.env.local` 파일을 만들고 테스트
   - 로컬에서 작동하면 GitHub Secrets 설정 문제일 가능성이 높습니다

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 배포

### GitHub Pages 배포

이 프로젝트는 GitHub Actions를 사용하여 자동으로 GitHub Pages에 배포됩니다.

1. **자동 배포**: `main` 브랜치에 푸시하면 자동으로 배포됩니다.
2. **수동 배포**: GitHub Actions 탭에서 "Deploy to GitHub Pages" 워크플로우를 수동으로 실행할 수 있습니다.

배포 시 GitHub Secrets에 저장된 환경 변수가 자동으로 사용됩니다.

### 로컬에서 배포 테스트

```bash
npm run deploy
```

이 명령은 로컬에서 빌드하고 GitHub Pages에 배포합니다. (로컬에서는 `.env.local` 파일의 환경 변수를 사용합니다)
