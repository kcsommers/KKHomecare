export interface HttpResponse {
  success: boolean;
  error: Error;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthorizedAdmin {
  username: string;
  id: string;
  token: string;
  expiresAt: number;
}

export interface LoginResult extends HttpResponse {
  data: {
    admin: AuthorizedAdmin
  }
}
