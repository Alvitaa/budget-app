export function setToken(token: string) {
  document.cookie = `token=${token}; path=/`;
}

export function removeToken() {
  document.cookie = "token=; path=/; max-age=0";
}