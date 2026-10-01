const API_BASE = (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "") : "") + "/api";

function getHeaders() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      let errDetail = "API request failed";
      try {
        const errorJson = await res.json();
        errDetail = errorJson.detail || JSON.stringify(errorJson);
      } catch {
        errDetail = res.statusText;
      }
      throw new Error(errDetail);
    }
    return await res.json();
  } catch (err) {
    console.error(`Error requesting ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login-json", { method: "POST", body: JSON.stringify(payload) }),
  getMe: () => request("/auth/me", { method: "GET" }),

  // Predictions
  predictDiabetes: (payload) => request("/predict/diabetes", { method: "POST", body: JSON.stringify(payload) }),
  predictHeart: (payload) => request("/predict/heart", { method: "POST", body: JSON.stringify(payload) }),
  predictKidney: (payload) => request("/predict/kidney", { method: "POST", body: JSON.stringify(payload) }),
  
  // History
  getHistory: (disease = null) => {
    const q = disease ? `?disease=${disease}` : "";
    return request(`/predict/history${q}`, { method: "GET" });
  },
  getPredictionDetail: (id) => request(`/predict/history/${id}`, { method: "GET" }),

  // Models Metadata & Benchmarks
  getModelMetrics: () => request("/models/metrics", { method: "GET" })
};
