const API_BASE_URL = "http://localhost:8000/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed (${response.status}): ${errorText || response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Stats & Dashboard Data
  getStats: () => request("/stats"),
  getActivity: () => request("/activity"),

  // Platform Controls
  togglePlatform: (platform) =>
    request(`/platforms/${platform}/toggle`, { method: "POST" }),

  // Approvals & Overrides
  getApprovals: () => request("/approvals"),
  approveReply: (id, content) =>
    request(`/approvals/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  rejectReply: (id) =>
    request(`/approvals/${id}/reject`, { method: "POST" }),

  // User Config settings
  getConfig: () => request("/config"),
  updateConfig: (config) =>
    request("/config", {
      method: "POST",
      body: JSON.stringify(config),
    }),

  // Arena Comparisons
  comparePrompt: (prompt) =>
    request("/compare", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    }),
};
