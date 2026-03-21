type BackendErrorPayload = {
  error_info?: unknown;
};

const NETWORK_ERROR_MESSAGE = "Could not connect to the server. Check your connection and try again.";

function toBackendErrorMessage(payload: BackendErrorPayload | null, fallbackMessage: string): string {
  const errorInfo = payload?.error_info;

  if (typeof errorInfo === "string" && errorInfo.trim()) {
    return errorInfo;
  }

  if (Array.isArray(errorInfo)) {
    const messages = errorInfo
      .map((item) => {
        if (item && typeof item === "object" && "msg" in item) {
          const message = (item as { msg?: unknown }).msg;
          return typeof message === "string" ? message : "";
        }

        return "";
      })
      .filter(Boolean)
      .join(", ");

    if (messages) {
      return messages;
    }
  }

  return fallbackMessage;
}

async function throwResponseError(response: Response, fallbackMessage: string): Promise<never> {
  const payload = (await response.json().catch(() => null)) as BackendErrorPayload | null;
  throw new Error(toBackendErrorMessage(payload, fallbackMessage));
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit | undefined,
  fallbackMessage: string,
): Promise<T> {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      await throwResponseError(response, fallbackMessage);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(NETWORK_ERROR_MESSAGE);
  }
}

export async function fetchVoid(
  url: string,
  init: RequestInit | undefined,
  fallbackMessage: string,
): Promise<void> {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      await throwResponseError(response, fallbackMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(NETWORK_ERROR_MESSAGE);
  }
}

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}