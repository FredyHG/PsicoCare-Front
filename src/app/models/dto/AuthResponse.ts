export class AuthResponse{

  access_token: string;
  refresh_token: string;

  constructor(accessToken: string, refreshToken: string) {
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
  }
}
