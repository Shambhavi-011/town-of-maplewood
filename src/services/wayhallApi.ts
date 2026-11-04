/**
 * Wayhall Public WebChat API Client
 * Connects to the WayHall AI Municipal Backend (AWS EC2 / Cloud Server).
 * Supports:
 *  - Anonymous Session Initialization (Step A)
 *  - Server-Sent Events (SSE) Streaming AI Responses (Step B)
 *  - SMS OTP Verification & Identity Linking (Step C)
 */

export const DEFAULT_WAYHALL_API_BASE =
  import.meta.env.VITE_WAYHALL_API_BASE || 'http://3.99.89.39:8000/api';

/**
 * Normalizes an API base URL so that it points cleanly to the /api root
 * whether the caller provided:
 * - http://3.99.89.39:8000
 * - http://3.99.89.39:8000/
 * - http://3.99.89.39:8000/api
 * - http://3.99.89.39:8000/api/
 * - https://example.com/api
 */
export function normalizeApiBase(base?: string): string {
  let cleaned = (base || DEFAULT_WAYHALL_API_BASE).trim().replace(/\/+$/, '');
  if (!cleaned) {
    cleaned = 'http://3.99.89.39:8000/api';
  }
  // Strip trailing /api so we have a clean root domain, then we route via getApiUrl
  if (cleaned.endsWith('/api')) {
    cleaned = cleaned.slice(0, -4);
  }
  return cleaned;
}

export function getApiUrl(apiBase: string, endpointPath: string): string {
  const root = normalizeApiBase(apiBase);
  const path = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  return `${root}${path}`;
}

export interface ResidentSessionResponse {
  is_anonymous: boolean;
  created: boolean;
  conversation: {
    id: number;
    resident_name: string;
    channel: string;
    messages?: Array<{
      id: number | string;
      text?: string;
      content?: string;
      sender?: string;
      role?: string;
      created_at?: string;
    }>;
  };
}

export interface CitationItem {
  title?: string;
  url?: string;
  document_id?: string;
  snippet?: string;
}

export interface StreamMetadataEvent {
  citations?: CitationItem[];
  sourceTitle?: string;
  sourceUrl?: string;
  permitLink?: {
    title: string;
    url: string;
    fee: string;
  };
  [key: string]: unknown;
}

export interface StreamDeltaEvent {
  delta?: string;
  text?: string;
  content?: string;
  [key: string]: unknown;
}

export interface StreamCompleteEvent {
  message_id?: number | string;
  status?: string;
  [key: string]: unknown;
}

export interface StreamQueryCallbacks {
  onMetadata?: (metadata: StreamMetadataEvent) => void;
  onDelta?: (delta: string) => void;
  onComplete?: (complete: StreamCompleteEvent) => void;
  onError?: (error: Error) => void;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'text/event-stream, application/json, */*',
  'ngrok-skip-browser-warning': 'true',
});

/**
 * Step A: Initialize or resume a resident session
 * Method: POST /api/chat/resident/session/
 */
export async function initResidentSession(
  apiBase: string = DEFAULT_WAYHALL_API_BASE,
  existingConversationId?: number | null
): Promise<ResidentSessionResponse> {
  const url = getApiUrl(apiBase, '/api/chat/resident/session/');
  const body = {
    share_contact: false,
    conversation_id: existingConversationId || null,
  };

  console.log('[WayHall API] Initializing resident session:', { url, body });

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to initialize session: HTTP ${response.status} ${response.statusText} ${errorText}`);
  }

  const data: ResidentSessionResponse = await response.json();
  console.log('[WayHall API] Resident session initialized successfully:', data);
  return data;
}

/**
 * Step B: Stream questions and receive Server-Sent Events (SSE) AI responses
 * Method: POST /api/chat/conversations/{conversation_id}/stream/
 */
export async function streamConversationQuery(
  options: {
    apiBase?: string;
    conversationId: number;
    query: string;
    callbacks: StreamQueryCallbacks;
    signal?: AbortSignal;
  }
): Promise<string> {
  const apiBase = options.apiBase || DEFAULT_WAYHALL_API_BASE;
  const url = getApiUrl(apiBase, `/api/chat/conversations/${options.conversationId}/stream/`);
  const body = { query: options.query };

  console.log('[WayHall API] Streaming query to conversation:', {
    url,
    conversationId: options.conversationId,
    query: options.query,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Streaming query failed: HTTP ${response.status} ${response.statusText} ${errorText}`);
  }

  if (!response.body) {
    throw new Error('Streaming response body is null or not supported by browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullAccumulatedText = '';
  let currentEventType = 'message';
  let receivedAnyDelta = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) {
          currentEventType = 'message';
          continue;
        }

        if (line.startsWith('event:')) {
          currentEventType = line.replace(/^event:\s*/, '').trim();
          continue;
        }

        if (line.startsWith('data:')) {
          const rawData = line.replace(/^data:\s*/, '');
          let parsed: unknown = rawData;
          try {
            parsed = JSON.parse(rawData);
          } catch {
            parsed = rawData;
          }

          if (currentEventType === 'metadata') {
            const meta = typeof parsed === 'object' && parsed !== null ? (parsed as StreamMetadataEvent) : {};
            options.callbacks.onMetadata?.(meta);
          } else if (currentEventType === 'delta') {
            let deltaText = '';
            if (typeof parsed === 'object' && parsed !== null) {
              const obj = parsed as Record<string, unknown>;
              deltaText = String(obj.delta ?? obj.text ?? obj.content ?? '');
            } else {
              deltaText = String(parsed);
            }
            if (deltaText) {
              receivedAnyDelta = true;
              fullAccumulatedText += deltaText;
              options.callbacks.onDelta?.(deltaText);
            }
          } else if (currentEventType === 'complete') {
            const completeData = typeof parsed === 'object' && parsed !== null ? (parsed as StreamCompleteEvent) : {};
            options.callbacks.onComplete?.(completeData);
          } else {
            // General or unspecified SSE event
            if (typeof parsed === 'object' && parsed !== null) {
              const obj = parsed as Record<string, unknown>;
              if (obj.delta || obj.text || obj.content) {
                const text = String(obj.delta ?? obj.text ?? obj.content ?? '');
                receivedAnyDelta = true;
                fullAccumulatedText += text;
                options.callbacks.onDelta?.(text);
              }
              if (obj.citations || obj.sourceTitle || obj.permitLink) {
                options.callbacks.onMetadata?.(obj as StreamMetadataEvent);
              }
            } else if (parsed) {
              receivedAnyDelta = true;
              fullAccumulatedText += String(parsed);
              options.callbacks.onDelta?.(String(parsed));
            }
          }
        }
      }
    }

    // Flush any leftover buffer if it was data
    if (buffer.trim().startsWith('data:')) {
      const raw = buffer.trim().replace(/^data:\s*/, '');
      try {
        const parsed = JSON.parse(raw);
        const text = String(parsed.delta ?? parsed.text ?? parsed);
        if (text) {
          receivedAnyDelta = true;
          fullAccumulatedText += text;
          options.callbacks.onDelta?.(text);
        }
      } catch {
        receivedAnyDelta = true;
        fullAccumulatedText += raw;
        options.callbacks.onDelta?.(raw);
      }
    }

    if (!receivedAnyDelta && !fullAccumulatedText) {
      console.warn('[WayHall API] Stream ended with no tokens returned.');
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return fullAccumulatedText;
    }
    options.callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
    throw err;
  }

  options.callbacks.onComplete?.({ status: 'completed' });
  return fullAccumulatedText;
}

/**
 * Step C (Part 1): Request SMS OTP verification code
 * Method: POST /api/chat/sms/request-code/
 */
export async function requestSmsCode(
  phoneNumber: string,
  apiBase: string = DEFAULT_WAYHALL_API_BASE
): Promise<{ success: boolean; message?: string }> {
  const url = getApiUrl(apiBase, '/api/chat/sms/request-code/');
  console.log('[WayHall API] Requesting SMS OTP code:', { url, phoneNumber });

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ phone_number: phoneNumber }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to send SMS code: HTTP ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Step C (Part 2): Verify SMS OTP verification code
 * Method: POST /api/chat/sms/verify-code/
 */
export async function verifySmsCode(
  phoneNumber: string,
  code: string,
  apiBase: string = DEFAULT_WAYHALL_API_BASE
): Promise<{ verified: boolean; message?: string }> {
  const url = getApiUrl(apiBase, '/api/chat/sms/verify-code/');
  console.log('[WayHall API] Verifying SMS OTP code:', { url, phoneNumber });

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ phone_number: phoneNumber, code: code.trim() }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Code verification failed: HTTP ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Step C (Part 3): Link session to resident identity and phone
 * Method: POST /api/chat/resident/session/
 */
export async function linkResidentSession(
  params: {
    conversationId: number;
    phoneNumber: string;
    residentName: string;
  },
  apiBase: string = DEFAULT_WAYHALL_API_BASE
): Promise<ResidentSessionResponse> {
  const url = getApiUrl(apiBase, '/api/chat/resident/session/');
  const body = {
    conversation_id: params.conversationId,
    share_contact: true,
    phone_number: params.phoneNumber,
    resident_name: params.residentName,
  };

  console.log('[WayHall API] Linking resident session identity:', { url, body });

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to link resident session: HTTP ${response.status} - ${errorText}`);
  }

  return await response.json();
}

