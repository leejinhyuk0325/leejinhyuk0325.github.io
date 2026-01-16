import { supabase } from "./supabase";

/**
 * 연재에 속한 글(posts) 가져오기
 */
export async function getPostsBySerialId(serialId) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("serial_id", serialId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("글 가져오기 오류:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("글 가져오기 예외:", err);
    return [];
  }
}

/**
 * ID로 개별 글(post) 가져오기
 */
export async function getPostByPostId(postId) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("글 가져오기 오류:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return data;
  } catch (err) {
    console.error("글 가져오기 예외:", err);
    return null;
  }
}

/**
 * 관리자 이메일 체크
 */
export function isAdminEmail(email) {
  const adminEmails = ["tightend01@naver.com"];
  return adminEmails.includes(email?.toLowerCase());
}

/**
 * 개별 글(post) 삭제
 * 작성자(author_id)가 일치하거나 관리자인 경우 삭제 가능
 */
export async function deletePost(postId, userId, userEmail) {
  try {
    if (!postId || !userId) {
      return { success: false, error: new Error("잘못된 요청입니다.") };
    }

    const isAdmin = isAdminEmail(userEmail);

    // 관리자는 author_id 체크 없이 삭제 가능
    if (isAdmin) {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        console.error("글 삭제 오류:", error);
        return { success: false, error };
      }

      return { success: true };
    } else {
      // 일반 사용자는 작성자만 삭제 가능
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("author_id", userId);

      if (error) {
        console.error("글 삭제 오류:", error);
        return { success: false, error };
      }

      return { success: true };
    }
  } catch (err) {
    console.error("글 삭제 예외:", err);
    return { success: false, error: err };
  }
}

/**
 * 연재에 속한 글(posts) 생성
 */
export async function createPost(serialId, postData) {
  try {
    // 현재 사용자 세션 가져오기
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("로그인이 필요합니다.");
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          serial_id: serialId,
          title: postData.title,
          content: postData.content,
          author_id: session.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("글 생성 오류:", error);
      throw error;
    }

    // 글 작성 후, 연재도전에서 공유 조건이 충족되고 연재에 글이 1개 이상 있으면 연재시작코너로 이동
    try {
      // serial 정보 가져오기
      const { getSerialById } = await import("./serials");
      const serial = await getSerialById(serialId);

      if (serial && serial.category === "popular") {
        // 공유 조건 확인
        const requiredShareCount = serial.requirement;

        if (requiredShareCount !== null && requiredShareCount !== undefined) {
          // 현재 공유 개수가 조건을 충족하는지 확인
          if (serial.shareCount >= requiredShareCount) {
            // 연재에 속한 글(posts) 개수 확인 (방금 작성한 글 포함)
            const posts = await getPostsBySerialId(serialId);

            // 연재에 글이 1개 이상 있으면 연재시작코너로 이동
            if (posts && posts.length >= 1) {
              // 카테고리를 serial로 변경
              const { error: updateError } = await supabase
                .from("serials")
                .update({ category: "serial" })
                .eq("id", serialId);

              if (updateError) {
                console.error(
                  `게시글 ${serialId} 연재시작코너 이동 실패:`,
                  updateError
                );
                // 에러가 발생해도 글 작성은 성공했으므로 계속 진행
              } else {
                console.log(
                  `게시글 ${serialId}가 연재시작코너로 이동되었습니다. (글 ${posts.length}개 작성됨)`
                );
              }
            }
          }
        }
      }
    } catch (moveError) {
      // 카테고리 이동 실패해도 글 작성은 성공했으므로 에러를 무시
      console.error("연재시작코너 이동 중 오류 (글 작성은 성공):", moveError);
    }

    return data;
  } catch (err) {
    console.error("글 생성 예외:", err);
    throw err;
  }
}
