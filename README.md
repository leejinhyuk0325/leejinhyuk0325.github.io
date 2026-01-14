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

#### Posts 테이블 설정 (필수)

이 프로젝트는 posts 데이터를 Supabase 데이터베이스에 저장합니다. 다음 단계를 따라 테이블을 생성하세요:

1. **Supabase 대시보드에서 SQL Editor 열기**

   - Supabase 대시보드에 로그인
   - 왼쪽 사이드바에서 **SQL Editor** 클릭
   - **New query** 클릭

2. **테이블 생성 SQL 실행**

   - `supabase/migrations/001_create_posts_table.sql` 파일의 내용을 복사
   - SQL Editor에 붙여넣고 **Run** 버튼 클릭

3. **기존 데이터 마이그레이션**

   **방법 1: SQL 마이그레이션 사용 (권장)**

   - Supabase 대시보드에서 **SQL Editor** 클릭
   - `supabase/migrations/003_insert_initial_posts.sql` 파일의 내용을 복사하여 실행
   - 가장 간단하고 빠른 방법입니다

   **방법 2: 마이그레이션 스크립트 사용**

   ```bash
   # .env.local 파일에 Supabase 환경 변수가 설정되어 있어야 합니다
   node scripts/migrate-posts-to-supabase.js
   ```

   **방법 3: Supabase 대시보드에서 직접 삽입**

   - Table Editor에서 `posts` 테이블 선택
   - `src/data/posts.js` 파일의 데이터를 참고하여 수동으로 입력

4. **자세한 설정 가이드**
   - `SUPABASE_SETUP.md` 파일을 참고하세요

**Posts 테이블 구조:**

- `id` (bigserial): Primary Key, Auto Increment
- `title` (text): 포스트 제목
- `deadline` (text): 마감일
- `apply` (text): 신청 상태
- `tags` (text): 태그 문자열
- `category` (text): 카테고리 ('popular', 'deadline', 'paid')
- `intro` (text): 소개글
- `requirement` (text): 요구사항
- `tag_list` (text[]): 태그 배열
- `created_at` (timestamptz): 생성일시
- `updated_at` (timestamptz): 수정일시

**Share 테이블 구조 (Many-to-Many):**

- `id` (bigserial): Primary Key, Auto Increment
- `post_id` (bigint): Post ID (Foreign Key)
- `user_id` (uuid): User ID (Foreign Key, auth.users 참조)
- `created_at` (timestamptz): 생성일시
- UNIQUE 제약: 한 사용자가 같은 post를 중복으로 share할 수 없음

**추가로 필요할 수 있는 테이블들:**

- **profiles**: 사용자 프로필 정보 (닉네임, 아바타, 소개 등)
- **comments**: 댓글 데이터
- **likes**: 좋아요 데이터
- 기타 프로젝트에 필요한 테이블들

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

## 동적 라우트 페이지 구현 가이드

### generateStaticParams() 필수 구현

Next.js의 `output: export` 설정을 사용할 때, 모든 동적 라우트(`[param]`)를 사용하는 페이지에는 반드시 `generateStaticParams()` 함수를 구현해야 합니다.

#### 단일 동적 파라미터 예시

```javascript
// src/app/detail/[id]/page.js
export async function generateStaticParams() {
  // 1부터 300까지의 ID를 미리 생성
  const ids = Array.from({ length: 50 }, (_, i) => i + 1);
  return ids.map((id) => ({
    id: id.toString(),
  }));
}

export default function DetailPage() {
  return <DetailContentWrapper />;
}
```

#### 중첩된 동적 파라미터 예시

중첩된 동적 라우트(`/serials/[id]/posts/[postId]`)의 경우, 모든 파라미터 조합을 반환해야 합니다:

```javascript
// src/app/serials/[id]/posts/[postId]/page.js
export async function generateStaticParams() {
  // serial ID: 1부터 300까지
  // post ID: 1부터 100까지
  const serialIds = Array.from({ length: 50 }, (_, i) => i + 1);
  const postIds = Array.from({ length: 50 }, (_, i) => i + 1);

  // 모든 조합 생성 (serialId와 postId의 모든 조합)
  return serialIds.flatMap((serialId) =>
    postIds.map((postId) => ({
      id: serialId.toString(),
      postId: postId.toString(),
    }))
  );
}

export default function PostDetailPage() {
  return <PostDetailContentWrapper />;
}
```

#### 주의사항

1. **모든 동적 라우트에 필수**: `[param]` 형태의 동적 라우트를 사용하는 모든 페이지에 `generateStaticParams()`를 구현해야 합니다.
2. **파라미터 이름 일치**: 반환 객체의 키는 폴더 이름과 정확히 일치해야 합니다 (`[id]` → `id`, `[postId]` → `postId`).
3. **문자열 변환**: 모든 ID 값은 문자열로 변환해야 합니다.
4. **중첩 라우트**: 중첩된 동적 라우트의 경우 모든 파라미터 조합을 반환해야 합니다.

#### 참고 예시

- ✅ `/detail/[id]/page.js` - 단일 파라미터
- ✅ `/community/[id]/page.js` - 단일 파라미터
- ✅ `/serials/[id]/posts/write/page.js` - 단일 파라미터
- ✅ `/serials/[id]/posts/[postId]/page.js` - 중첩 파라미터 (모든 조합 필요)

이 패턴을 따르지 않으면 빌드 시 다음과 같은 오류가 발생합니다:

```
Error: Page "/serials/[id]" is missing "generateStaticParams()" so it cannot be used with "output: export" config.
```
