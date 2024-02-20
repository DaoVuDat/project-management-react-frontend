const ACCESS_TOKEN = 'access_token';

export function storeAccessToken(accessToken: string) {
  console.log(accessToken);
  localStorage.setItem(ACCESS_TOKEN, accessToken);
}

export function getAccessToken(): string {
  return localStorage.getItem(ACCESS_TOKEN) ?? '';
}
