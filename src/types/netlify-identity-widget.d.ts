declare module 'netlify-identity-widget' {
  interface User {
    id: string;
    email: string;
    user_metadata: Record<string, any>;
    app_metadata: Record<string, any>;
    token?: {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      expires_at: number;
    };
  }

  function init(opts?: { container?: string; logo?: boolean; namePlaceholder?: string }): void;
  function open(tab?: 'login' | 'signup'): void;
  function close(): void;
  function logout(): void;
  function currentUser(): User | null;
  function on(event: string, cb: (...args: any[]) => void): void;
  function off(event: string, cb?: (...args: any[]) => void): void;
  function refresh(): Promise<string>;
}
