import { supabase } from "./supabase";

/**
 * Config 테이블에서 모든 설정값 가져오기
 * @returns {Promise<Record<string, string>>} - key-value 형태의 설정값 객체
 */
export async function getAllConfigValues() {
  try {
    const { data, error } = await supabase.from("config").select("key, value");

    if (error) {
      console.error("Config 값 가져오기 오류:", error);
      return {};
    }

    // key-value 형태의 객체로 변환
    const configMap = {};
    if (data) {
      data.forEach((item) => {
        configMap[item.key] = item.value;
      });
    }

    return configMap;
  } catch (err) {
    console.error("Config 값 가져오기 예외:", err);
    return {};
  }
}

/**
 * Config 테이블에서 설정값 가져오기 (단일)
 * @param {string} key - 설정 키
 * @returns {Promise<string | null>} - 설정 값 (없으면 null)
 */
export async function getConfigValue(key) {
  try {
    const { data, error } = await supabase
      .from("config")
      .select("value")
      .eq("key", key)
      .single();

    if (error) {
      console.error(`Config 값 가져오기 오류 (key: ${key}):`, error);
      return null;
    }

    return data?.value || null;
  } catch (err) {
    console.error(`Config 값 가져오기 예외 (key: ${key}):`, err);
    return null;
  }
}
