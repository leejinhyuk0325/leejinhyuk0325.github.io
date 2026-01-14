"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import html2canvas from "html2canvas-pro";
import { supabase } from "@/utils/supabase";
import {
  addShare,
  hasUserShared,
  getShareCount,
  addFavorite,
  removeFavorite,
  hasUserFavorited,
  getPostsBySerialId,
  deletePost,
  deleteSerial,
  isAdminEmail,
} from "@/utils/posts";

export default function DetailContent({ post, tagList }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const captureAreaRef = useRef(null);

  // 컴포넌트 마운트 시 최신 공유 수 가져오기
  useEffect(() => {
    const fetchLatestShareCount = async () => {
      try {
        const latestCount = await getShareCount(post.id);
        setShareCount(latestCount);
      } catch (error) {
        console.error("공유 수 가져오기 실패:", error);
      }
    };

    fetchLatestShareCount();
  }, [post.id]);

  // 현재 사용자 확인
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setCurrentUserId(session.user.id);
          setCurrentUserEmail(session.user.email);
        }
      } catch (error) {
        console.error("사용자 확인 실패:", error);
      } finally {
        setCheckingUser(false);
      }
    };

    checkCurrentUser();
  }, []);

  // 관심있는 글 상태 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const favorited = await hasUserFavorited(post.id, session.user.id);
          setIsFavorited(favorited);
        }
      } catch (error) {
        console.error("관심있는 글 상태 확인 실패:", error);
      } finally {
        setCheckingFavorite(false);
      }
    };

    checkFavoriteStatus();
  }, [post.id]);

  // 연재에 속한 글(posts) 가져오기
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoadingPosts(true);
        const postsData = await getPostsBySerialId(post.id);
        setPosts(postsData || []);
      } catch (error) {
        console.error("글 목록 로드 실패:", error);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (post.id) {
      loadPosts();
    }

    // 페이지 포커스 시 글 목록 새로고침 (글 작성 후 돌아왔을 때 자동 업데이트)
    const handleFocus = () => {
      if (post.id) {
        loadPosts();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [post.id]);

  const handleToggleFavorite = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const userId = session.user.id;
    const postId = post.id;

    try {
      if (isFavorited) {
        const result = await removeFavorite(postId, userId);
        if (result.success) {
          setIsFavorited(false);
        }
      } else {
        const result = await addFavorite(postId, userId);
        if (result.success) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error("관심있는 글 토글 실패:", error);
    }
  };

  const handleApplyClick = async () => {
    // 사용자 세션 확인
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      router.push("/login");
      return;
    }

    const userId = session.user.id;
    const postId = post.id;

    // 이미 공유했는지 확인
    const alreadyShared = await hasUserShared(postId, userId);

    // 공유하지 않은 경우에만 shares 테이블에 추가
    if (!alreadyShared) {
      const result = await addShare(postId, userId);
      if (result.success) {
        // 공유 수 업데이트
        setShareCount((prev) => prev + 1);
      } else {
        console.error("공유 추가 실패:", result.error);
        // 에러가 발생해도 모달은 띄움
      }
    }

    // 모달 열기
    setIsModalOpen(true);
    setIsCapturing(true);

    // DOM이 업데이트될 시간을 주기 위해 약간의 지연
    setTimeout(async () => {
      try {
        const element = document.getElementById("capture-area");
        if (!element) {
          console.error("capture-area를 찾을 수 없습니다.");
          setIsCapturing(false);
          return;
        }

        const canvas = await html2canvas(element, {
          backgroundColor: "#f9fafb", // bg-gray-50
          scale: 2, // 고해상도
          logging: false,
          useCORS: true,
          allowTaint: false,
          removeContainer: true,
          imageTimeout: 0,
          onclone: (clonedDoc, clonedElement) => {
            // lab() 색상을 안전한 색상으로 변환하는 헬퍼 함수
            const sanitizeColor = (colorValue) => {
              if (!colorValue || typeof colorValue !== "string") {
                return colorValue;
              }

              // lab(), oklab(), lch() 색상이 포함된 경우 제거
              if (
                colorValue.includes("lab(") ||
                colorValue.includes("oklab(") ||
                colorValue.includes("lch(") ||
                colorValue.includes("color-mix(") ||
                colorValue.includes("light-dark(")
              ) {
                return null; // null을 반환하면 해당 속성을 설정하지 않음
              }

              return colorValue;
            };

            // 모든 <style> 태그와 <link rel="stylesheet"> 태그 제거
            try {
              const styleTags = clonedDoc.querySelectorAll("style");
              styleTags.forEach((styleTag) => {
                styleTag.remove();
              });

              const linkTags = clonedDoc.querySelectorAll(
                'link[rel="stylesheet"]'
              );
              linkTags.forEach((linkTag) => {
                linkTag.remove();
              });
            } catch (e) {
              console.warn("스타일 태그 제거 실패:", e);
            }

            // 모든 요소의 인라인 스타일에서 lab() 색상 제거
            const removeLabColorsFromStyles = (element) => {
              if (!element || !element.style) return;

              try {
                // 모든 인라인 스타일 속성 검사
                const style = element.style;
                const colorProperties = [
                  "color",
                  "backgroundColor",
                  "background-color",
                  "borderColor",
                  "border-color",
                  "borderTopColor",
                  "border-top-color",
                  "borderRightColor",
                  "border-right-color",
                  "borderBottomColor",
                  "border-bottom-color",
                  "borderLeftColor",
                  "border-left-color",
                  "outlineColor",
                  "outline-color",
                  "textDecorationColor",
                  "text-decoration-color",
                ];

                colorProperties.forEach((prop) => {
                  try {
                    const value = style.getPropertyValue(prop);
                    if (value && sanitizeColor(value) === null) {
                      style.removeProperty(prop);
                    }
                  } catch (e) {
                    // 무시
                  }
                });
              } catch (e) {
                // 무시
              }
            };

            // 모든 요소에 계산된 스타일을 인라인으로 적용
            const walkElements = (clonedEl, originalEl) => {
              if (!clonedEl || !originalEl) return;

              // 먼저 인라인 스타일에서 lab() 색상 제거
              removeLabColorsFromStyles(clonedEl);

              try {
                const originalStyle = window.getComputedStyle(originalEl);

                // 색상이 아닌 속성들
                const nonColorProperties = [
                  "borderWidth",
                  "borderTopWidth",
                  "borderRightWidth",
                  "borderBottomWidth",
                  "borderLeftWidth",
                  "borderStyle",
                  "borderTopStyle",
                  "borderRightStyle",
                  "borderBottomStyle",
                  "borderLeftStyle",
                  "borderRadius",
                  "padding",
                  "paddingTop",
                  "paddingRight",
                  "paddingBottom",
                  "paddingLeft",
                  "margin",
                  "marginTop",
                  "marginRight",
                  "marginBottom",
                  "marginLeft",
                  "fontSize",
                  "fontWeight",
                  "fontFamily",
                  "lineHeight",
                  "textAlign",
                  "display",
                  "flexDirection",
                  "justifyContent",
                  "alignItems",
                  "width",
                  "height",
                  "minWidth",
                  "minHeight",
                  "maxWidth",
                  "maxHeight",
                ];

                nonColorProperties.forEach((prop) => {
                  try {
                    const computedValue = originalStyle[prop];
                    if (
                      computedValue &&
                      computedValue !== "none" &&
                      computedValue !== "auto"
                    ) {
                      const cssProp = prop
                        .replace(/([A-Z])/g, "-$1")
                        .toLowerCase();
                      clonedEl.style.setProperty(
                        cssProp,
                        computedValue,
                        "important"
                      );
                    }
                  } catch (e) {
                    // 개별 속성 변환 실패 무시
                  }
                });

                // 색상 속성은 별도로 처리 (lab() 색상 필터링)
                const colorProperties = [
                  "color",
                  "backgroundColor",
                  "borderColor",
                  "borderTopColor",
                  "borderRightColor",
                  "borderBottomColor",
                  "borderLeftColor",
                ];

                colorProperties.forEach((prop) => {
                  try {
                    const computedValue = originalStyle[prop];
                    if (
                      computedValue &&
                      computedValue !== "transparent" &&
                      computedValue !== "rgba(0, 0, 0, 0)"
                    ) {
                      const sanitizedValue = sanitizeColor(computedValue);
                      if (sanitizedValue) {
                        const cssProp = prop
                          .replace(/([A-Z])/g, "-$1")
                          .toLowerCase();
                        clonedEl.style.setProperty(
                          cssProp,
                          sanitizedValue,
                          "important"
                        );
                      }
                    }
                  } catch (e) {
                    // 개별 속성 변환 실패 무시
                  }
                });
              } catch (e) {
                // 에러 무시
              }

              // 자식 요소들도 재귀적으로 처리
              const clonedChildren = Array.from(clonedEl.children);
              const originalChildren = Array.from(originalEl.children);

              clonedChildren.forEach((clonedChild, index) => {
                if (originalChildren[index]) {
                  walkElements(clonedChild, originalChildren[index]);
                }
              });
            };

            // 루트 요소부터 시작
            const originalElement = document.getElementById("capture-area");
            if (originalElement && clonedElement) {
              walkElements(clonedElement, originalElement);
            }
          },
        });

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.95);
        setCapturedImage(imageDataUrl);
      } catch (error) {
        console.error("이미지 캡처 중 오류 발생:", error);
      } finally {
        setIsCapturing(false);
      }
    }, 100);
  };

  const handleDownload = () => {
    if (!capturedImage) return;

    const link = document.createElement("a");
    link.download = `${post.title || "taste-application"}.jpg`;
    link.href = capturedImage;
    link.click();
  };

  const handleShare = async () => {
    const tagsText = tagList.join(" ");
    const shareText = `[${post.title}]\n\n${post.intro}\n\n${tagsText}`;

    try {
      await navigator.clipboard.writeText(shareText);
      // 복사 성공 알림 (선택사항)
      alert("클립보드에 복사되었습니다!");
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      // 폴백: 텍스트 영역을 사용한 복사
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("클립보드에 복사되었습니다!");
      } catch (err) {
        console.error("복사 실패:", err);
        alert("복사에 실패했습니다. 텍스트를 직접 복사해주세요.");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCapturedImage(null);
  };

  // 개별 글 삭제
  const handleDeletePost = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (
      !window.confirm(
        "정말 이 글을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
      )
    ) {
      return;
    }

    const result = await deletePost(postId, currentUserId, currentUserEmail);

    if (result.success) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      alert("글이 삭제되었습니다.");
    } else {
      console.error("글 삭제 실패:", result.error);
      alert("글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // 연재(serial) 삭제 (관리자만 가능)
  const handleDeleteSerial = async () => {
    if (!currentUserEmail || !isAdminEmail(currentUserEmail)) {
      alert("관리자만 연재를 삭제할 수 있습니다.");
      return;
    }

    if (
      !window.confirm(
        "정말 이 연재를 삭제하시겠습니까? 연재와 모든 글(posts)이 삭제되며, 삭제 후에는 복구할 수 없습니다."
      )
    ) {
      return;
    }

    const result = await deleteSerial(post.id, currentUserEmail);

    if (result.success) {
      alert("연재가 삭제되었습니다.");
      // 완전한 페이지 리로드를 통해 서버 컴포넌트 캐시를 무효화
      window.location.href = "/";
    } else {
      console.error("연재 삭제 실패:", result.error);
      alert(
        result.error?.message ||
          "연재 삭제에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  };

  // 공유 조건 달성 여부 확인 (requirement는 이제 INTEGER)
  const isRequirementMet = () => {
    const requiredShareCount = post.requirement;
    if (requiredShareCount === null || requiredShareCount === undefined)
      return false;
    return shareCount >= requiredShareCount;
  };

  // 작성자인지 확인
  const isAuthor = () => {
    if (!currentUserId || !post.author_id) return false;
    return currentUserId === post.author_id;
  };

  // 관리자인지 확인
  const isAdmin = () => {
    return currentUserEmail && isAdminEmail(currentUserEmail);
  };

  const requirementMet = isRequirementMet();
  const showWriteButton = !checkingUser && isAuthor() && requirementMet;
  const showAdminDeleteButton = !checkingUser && isAdmin();

  return (
    <>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="capture-area" ref={captureAreaRef}>
          {/* Campaign Info Section */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm ${
                      post.category === "serial"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : post.category === "popular"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                        : post.category === "deadline"
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    }`}
                  >
                    {post.category === "serial"
                      ? "연재시작코너"
                      : post.category === "popular"
                      ? "연재도전"
                      : post.category === "deadline"
                      ? "오늘 마감"
                      : "유료연재"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.deadlineDisplay || post.deadline}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 flex-1">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    {showAdminDeleteButton && (
                      <button
                        onClick={handleDeleteSerial}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        title="연재 삭제 (관리자)"
                      >
                        연재 삭제
                      </button>
                    )}
                    {!checkingFavorite && (
                      <button
                        onClick={handleToggleFavorite}
                        className={`p-2 rounded-md transition-colors ${
                          isFavorited
                            ? "text-red-600 hover:text-red-700"
                            : "text-gray-400 hover:text-red-600"
                        }`}
                        title={
                          isFavorited
                            ? "관심있는 글에서 제거"
                            : "관심있는 글에 추가"
                        }
                      >
                        <svg
                          className="w-6 h-6"
                          fill={isFavorited ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-600">현재 공유: </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {shareCount}회
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-blue-50 rounded-lg p-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    연재 시작 조건
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {post.requirement}공유
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Intro Section */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">도입부</h2>
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.intro}
              </div>
              <div className="text-center text-2xl text-yellow-400 mt-6">★</div>
            </div>
          </section>
        </div>

        {/* Notice Section */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            참여 전 필수 확인사항
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                재밌으셨다면 <strong className="font-semibold">공유</strong>{" "}
                해주세요.
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                여러분의 관심이 작가에게{" "}
                <strong className="font-semibold">큰 힘</strong>이 됩니다.
              </span>
            </li>
          </ul>
        </section>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tagList.map((tag, index) => {
            const tagName = tag.replace("#", "");
            return (
              <Link
                key={index}
                href={`/search?tag=${encodeURIComponent(tagName)}`}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
              >
                {tag}
              </Link>
            );
          })}
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] text-lg"
        >
          공유하기
        </button>

        {/* 연재 글 목록 - 포스트가 1개 이상일 때 표시 */}
        {posts.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              연재 글 목록
            </h2>
            {loadingPosts ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((postItem, index) => {
                  const isPostAuthor =
                    currentUserId && postItem.author_id === currentUserId;
                  const canDeletePost = isPostAuthor || isAdmin();

                  return (
                    <Link
                      key={postItem.id}
                      href={`/serials/${post.id}/posts/${postItem.id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-500">
                              {posts.length - index}화
                            </span>
                            <h3 className="text-lg font-bold text-gray-900">
                              {postItem.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {postItem.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(postItem.created_at).toLocaleDateString(
                              "ko-KR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        {canDeletePost && (
                          <button
                            type="button"
                            onClick={(e) => handleDeletePost(e, postItem.id)}
                            className="ml-4 px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                            title={isAdmin() ? "삭제 (관리자)" : "삭제"}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 글쓰기 버튼 - 공유 조건 달성 시 작성자에게만 표시 */}
        {showWriteButton && (
          <Link
            href={`/serials/${post.id}/posts/write`}
            className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] text-lg flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            글쓰기
          </Link>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                TASTE 신청 이미지 미리보기
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {isCapturing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">이미지를 생성하는 중...</p>
                </div>
              ) : capturedImage ? (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={capturedImage}
                      alt="TASTE 신청 이미지"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                    >
                      이미지 다운로드
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-shrink-0 w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                      title="공유하기"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">이미지를 생성할 수 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
