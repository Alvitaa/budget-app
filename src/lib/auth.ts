export function setToken(token: string) {
  const maxAge = 60 * 69 * 24 * 7; // 7 días
  document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeToken() {
  document.cookie = "token=; path=/; max-age=0";
}