# Google OAuth 로그인 설정 가이드

Google 로그인 기능을 사용하기 위해 다음 단계를 따라 설정해주세요.

## 1. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성

### 1.1 프로젝트 생성 또는 선택
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 상단의 프로젝트 선택 드롭다운에서 새 프로젝트를 생성하거나 기존 프로젝트를 선택

### 1.2 OAuth 동의 화면 구성
1. 왼쪽 메뉴에서 **API 및 서비스** > **OAuth 동의 화면** 클릭
2. **외부** 사용자 유형 선택 (내부는 Google Workspace 계정만 가능)
3. **만들기** 클릭
4. 다음 정보 입력:
   - **앱 이름**: Creative Crowdfunding (또는 원하는 이름)
   - **사용자 지원 이메일**: 본인의 이메일 주소
   - **앱 로고**: 선택사항
   - **개발자 연락처 정보**: 본인의 이메일 주소
5. **저장 후 계속** 클릭
6. **범위** 단계에서 **저장 후 계속** 클릭 (기본 범위만 사용)
7. **테스트 사용자** 단계에서 **저장 후 계속** 클릭 (필요시 테스트 사용자 추가)
8. **요약** 단계에서 **대시보드로 돌아가기** 클릭

### 1.3 OAuth 2.0 클라이언트 ID 생성
1. 왼쪽 메뉴에서 **API 및 서비스** > **사용자 인증 정보** 클릭
2. 상단의 **+ 사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 클릭
3. **애플리케이션 유형**: **웹 애플리케이션** 선택
4. **이름**: 원하는 이름 입력 (예: "CCF Web Client")
5. **승인된 JavaScript 원본**:
   - 개발 환경: `http://localhost:3000`
   - 프로덕션 환경: `https://leejinhyuk0325.github.io` (또는 실제 도메인)
6. **승인된 리디렉션 URI**:
   - 개발 환경: `http://localhost:3000/auth/callback`
   - 프로덕션 환경: `https://your-project-ref.supabase.co/auth/v1/callback`
     - ⚠️ **중요**: `your-project-ref`는 Supabase 프로젝트의 참조 ID입니다
     - Supabase 대시보드 > Settings > API에서 확인 가능
     - 형식: `https://[프로젝트-참조-ID].supabase.co/auth/v1/callback`
7. **만들기** 클릭
8. 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀번호**를 복사해두세요
   - ⚠️ 클라이언트 보안 비밀번호는 한 번만 표시되므로 반드시 복사해두세요

## 2. Supabase에서 Google Provider 설정

### 2.1 Google Provider 활성화
1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. 왼쪽 사이드바에서 **Authentication** > **Providers** 클릭
4. **Google** Provider 찾기
5. **Google** Provider 옆의 토글을 **활성화**

### 2.2 Google Provider 설정 입력
1. **Client ID (for OAuth)**: Google Cloud Console에서 복사한 클라이언트 ID 입력
2. **Client Secret (for OAuth)**: Google Cloud Console에서 복사한 클라이언트 보안 비밀번호 입력
3. **Save** 클릭

## 3. OAuth 동의 화면 게시 (프로덕션 사용 시)

⚠️ **중요**: Google OAuth는 기본적으로 테스트 모드로 시작합니다. 테스트 모드에서는 최대 100명의 테스트 사용자만 로그인할 수 있습니다.

### 프로덕션에서 모든 사용자가 로그인할 수 있도록 하려면:
1. Google Cloud Console > **API 및 서비스** > **OAuth 동의 화면**으로 이동
2. **앱 게시** 버튼 클릭
3. 확인 대화상자에서 **확인** 클릭
4. Google 검토 프로세스를 완료해야 할 수 있습니다 (보통 몇 일 소요)

## 4. 테스트

설정이 완료되면 다음을 테스트해보세요:

1. 로그인 페이지(`/login`)에서 **"구글로 로그인"** 버튼 클릭
2. Google 로그인 화면으로 리디렉션되는지 확인
3. Google 계정으로 로그인
4. `/auth/callback`으로 리디렉션되어 로그인이 완료되는지 확인

## 문제 해결

### "redirect_uri_mismatch" 오류
- Google Cloud Console의 **승인된 리디렉션 URI**가 Supabase 콜백 URL과 정확히 일치하는지 확인
- Supabase 콜백 URL 형식: `https://[프로젝트-참조-ID].supabase.co/auth/v1/callback`

### "access_denied" 오류
- OAuth 동의 화면이 아직 게시되지 않았고, 로그인하려는 사용자가 테스트 사용자 목록에 없는 경우 발생
- Google Cloud Console > OAuth 동의 화면 > 테스트 사용자에 사용자 이메일 추가
- 또는 앱을 게시하여 모든 사용자가 로그인할 수 있도록 설정

### "invalid_client" 오류
- Supabase에 입력한 Client ID 또는 Client Secret이 잘못되었을 수 있음
- Google Cloud Console에서 다시 확인하고 Supabase에 정확히 입력

## 참고 사항

- Google OAuth는 GitHub OAuth와 동일한 방식으로 작동합니다
- 기존 `/auth/callback` 페이지가 Google 로그인도 처리합니다
- 로그인 후 사용자는 자동으로 `/mypage`로 리디렉션됩니다
