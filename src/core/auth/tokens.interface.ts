export interface IAccessTokenPayload {
  email: string;
  id: string;
  iat: number;
  exp: number;
  username?: string;
  role?: string;
  blockchainAddress?: string;
}
