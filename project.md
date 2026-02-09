# EveryDay English - Frontend Project Documentation

## 프로젝트 개요
EveryDay English 학원을 위한 자료 관리 및 커뮤니티 플랫폼의 프론트엔드

## 기술 스택
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL, Storage, Auth)
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Zustand (선택)
- **Form Management**: React Hook Form (선택)
- **Data Fetching**: Supabase Client / TanStack Query (선택)

## 사용자 권한 (User Roles)
- **Teacher (선생님)**: 모든 기능 접근 가능
- **Student (학생)**: 제한된 기능 접근

## 주요 기능 (Core Features)

### 1. 인증 (Authentication)
- 로그인
- 회원가입 (계정 생성)
- 로그아웃
- 권한별 라우팅 보호

### 2. 자료실 (File Management)

#### 2.1 선생님 자료실 (Teacher Only)
- **접근 권한**: 선생님만
- **기능**:
  - 카테고리 관리 (생성/수정/삭제)
  - 파일 업로드
  - 파일 목록 조회
  - 파일 다운로드
  - 파일 삭제

#### 2.2 공유 자료실 (Shared Resources)
- **접근 권한**: 선생님 + 학생
- **기능**:
  - 카테고리별 파일 조회
  - 파일 다운로드
  - (선생님만) 파일 업로드/삭제

### 3. 카테고리 시스템 (Category System)

#### 카테고리 분류 기준
- 학년별 (예: 초등 3학년, 중등 1학년, 고등 2학년)
- 출판사별 (예: 능률, YBM, 천재, 동아)
- 혼합 분류 가능 (예: 중등1학년-능률)

#### 카테고리 속성
- 카테고리명
- 설명
- 접근 권한 (teacher_only / public)
- 생성일/수정일

### 4. 커뮤니티 (Community)

#### 4.1 게시판 (Board)
- 공지사항 (선생님만 작성 가능)
- 일반 게시판 (모두 작성 가능)
- 게시글 CRUD
- 댓글 기능

#### 4.2 Q&A
- 질문 작성
- 답변 작성
- 질문 상태 관리 (대기/답변완료)

## 페이지 구조 (Page Structure - Next.js App Router)