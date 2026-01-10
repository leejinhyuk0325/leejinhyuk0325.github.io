# Supabase 이메일 확인 설정 방법

## 이메일 인증 활성화 (회원가입 시 필수)

회원가입 시 이메일 인증이 필요하도록 설정하려면:

1. **Supabase 대시보드 접속**

   - [Supabase](https://supabase.com)에 로그인
   - 프로젝트 선택

2. **Authentication 설정으로 이동**

   - 왼쪽 사이드바에서 **Authentication** 클릭
   - **Settings** 탭 클릭

3. **이메일 확인 활성화**

   - **Email Auth** 섹션 찾기
   - **"Enable email confirmations"** 옵션을 **ON**으로 설정
   - **Save** 버튼 클릭

4. **이메일 템플릿 확인**
   - **Authentication > Email Templates**로 이동
   - **Confirm signup** 템플릿이 올바르게 설정되어 있는지 확인
   - 리다이렉트 URL이 `${YOUR_SITE_URL}/auth/callback`로 설정되어 있는지 확인

## 이메일 확인 비활성화 (개발용)

개발/테스트 환경에서 이메일 확인을 비활성화하려면:

1. **Supabase 대시보드 접속**

   - [Supabase](https://supabase.com)에 로그인
   - 프로젝트 선택

2. **Authentication 설정으로 이동**

   - 왼쪽 사이드바에서 **Authentication** 클릭
   - **Settings** 탭 클릭

3. **이메일 확인 비활성화**

   - **Email Auth** 섹션 찾기
   - **"Enable email confirmations"** 옵션을 **OFF**로 변경
   - 또는 **"Confirm email"** 체크박스를 해제
   - **Save** 버튼 클릭

4. **변경 사항 적용**
   - 설정이 저장되면 즉시 적용됩니다
   - 이제 회원가입한 사용자는 이메일 확인 없이 바로 로그인할 수 있습니다

## 방법 2: 개발 환경에서만 비활성화 (선택사항)

프로덕션 환경에서는 이메일 확인을 유지하고, 개발 환경에서만 비활성화하려면:

1. Supabase 대시보드에서 **Authentication > Settings**로 이동
2. **Email Auth** 섹션에서 **"Enable email confirmations"**를 OFF로 설정
3. 개발이 완료되면 다시 ON으로 설정

## 주의사항

- ⚠️ **보안**: 이메일 확인을 비활성화하면 누구나 가짜 이메일로 계정을 만들 수 있습니다
- 개발/테스트 환경에서는 비활성화해도 되지만, 프로덕션 환경에서는 보안을 위해 활성화하는 것을 권장합니다
- 이메일 확인을 활성화하려면 Supabase의 **Email Templates** 설정에서 이메일 템플릿을 구성해야 합니다

## 이메일 확인을 유지하면서 사용하는 방법

이메일 확인을 유지하고 싶다면:

1. Supabase 대시보드에서 **Authentication > Email Templates**로 이동
2. **Confirm signup** 템플릿 확인
3. 이메일 템플릿이 올바르게 설정되어 있는지 확인
4. 회원가입 시 이메일로 전송되는 확인 링크를 클릭하면 로그인 가능
