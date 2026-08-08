/* eslint-disable no-unused-vars */

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
  state?: string;
}

interface GooglePromptMomentNotification {
  isSkippedMoment(): boolean;
  isDismissedMoment(): boolean;
}

interface GoogleAccountsId {
  initialize(opts: {
    client_id: string;
    ux_mode: "popup";
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  prompt(callback?: (notification: GooglePromptMomentNotification) => void): void;
  cancel(): void;
}

interface AppleAppAuthorization {
  code: string;
  id_token: string;
  state?: string;
}

interface AppleAuthResponse {
  authorization: AppleAppAuthorization;
  user?: { email: string; name: { firstName: string; lastName: string } };
}

interface AppleAuthGlobal {
  init(config: {
    clientId?: string;
    redirectURI?: string;
    scope?: string;
    state?: string;
    nonce?: string;
    usePopup?: boolean;
  }): void;
  signIn(config?: {
    clientId?: string;
    redirectURI?: string;
    scope?: string;
    state?: string;
    nonce?: string;
    usePopup?: boolean;
  }): Promise<AppleAuthResponse>;
  renderButton(): void;
}

interface Window {
  google?: {
    accounts?: {
      id: GoogleAccountsId;
    };
  };
  AppleID?: {
    auth: AppleAuthGlobal;
  };
}