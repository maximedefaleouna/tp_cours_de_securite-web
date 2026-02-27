const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP Error: ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json() as Promise<T>;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data: unknown, customHeaders?: HeadersInit): Promise<T> => {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = isFormData 
      ? { Authorization: getHeaders()['Authorization'] || '' }
      : getHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: customHeaders || headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse<T>(response);
  },
};

export { ApiError, API_BASE_URL };
