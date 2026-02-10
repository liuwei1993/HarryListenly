const BASE = process.env.NEXT_PUBLIC_AUDIO_BASE_URL || "";

/** 将相对路径转为可访问的音频 URL（兼容后续迁 OSS） */
export function getAudioUrl(relativePath: string): string {
  if (relativePath.startsWith("http")) return relativePath;
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return BASE ? `${BASE.replace(/\/$/, "")}${path}` : path;
}
