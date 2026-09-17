// O build de CDN não traz tipos. Declare o que você usa.
// Este arquivo é idêntico em todos os exemplos de web/. Mudou aqui, mude nos outros.

export interface WebSdkEvent {
  type: string;
  payload?: Record<string, unknown>;
}
export interface WebSdkCompleteResult {
  status: "submitted" | "abandoned";
}
export interface WebSdkCancelResult {
  sessionId?: string;
}
export interface WebSdkError {
  code: number;
  name: string;
  type: string;
  message: string;
  user_message: string;
  context?: Record<string, unknown>;
  doc_url?: string;
  recoverable: boolean;
}
export interface LegitimuzWidgetHandle {
  destroy(): void;
  readonly ready: Promise<void>;
}
export interface MountOptions {
  sdkUrl: string;
  target: HTMLElement;
  colorScheme?: "light" | "dark" | "auto";
  locale?: string;
  closeButton?: "left" | "right" | "hidden";
  iframeTitle?: string;
  readyTimeoutMs?: number;
  onReady?: () => void;
  onEvent?: (event: WebSdkEvent) => void;
  /** Filtro opt-in do onEvent. Ausente, tudo passa. Não afeta onComplete/onCancel/onError. */
  eventsAllowlist?: readonly string[];
  onComplete?: (result: WebSdkCompleteResult) => void;
  onCancel?: (result: WebSdkCancelResult) => void;
  onError?: (error: WebSdkError) => void;
}

declare global {
  interface Window {
    Legitimuz: { mount(options: MountOptions): LegitimuzWidgetHandle };
  }
}
