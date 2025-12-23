const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api/v1/social/posts";

const authHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const jsonHeaders = () => ({
  "Content-Type": "application/json",
  ...authHeaders(),
});

const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
};

const postInteractionService = {
  async getFeed(page = 0, size = 20) {
    try {
      const url = `${API_BASE}/feed?page=${page}&size=${size}`;
      const res = await fetch(url, { headers: authHeaders() });
      return handleResponse(res);
    } catch (e) {
      return { data: [] };
    }
  },

  async createPost({ content, mediaType, mediaUrl }) {
    const body = {
      content,
      postType: mediaType === "video" ? "VIDEO" : mediaUrl ? "IMAGE" : "TEXT",
      imageUrl: mediaType === "image" ? mediaUrl : null,
      videoUrl: mediaType === "video" ? mediaUrl : null,
      videoThumbnail: null,
    };
    const res = await fetch(`${API_BASE}/create`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async react(postId, reactionType = "LIKE") {
    const res = await fetch(`${API_BASE}/${postId}/react`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ reactionType }),
    });
    return handleResponse(res);
  },

  async unlike(postId) {
    const res = await fetch(`${API_BASE}/${postId}/react`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async addComment(postId, content, imageUrl = null) {
    const res = await fetch(`${API_BASE}/${postId}/comments`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ content, imageUrl }),
    });
    return handleResponse(res);
  },

  async addReply(postId, commentId, content) {
    const res = await fetch(`${API_BASE}/${postId}/comments/${commentId}/reply`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ content }),
    });
    return handleResponse(res);
  },

  async save(postId) {
    const res = await fetch(`${API_BASE}/${postId}/save`, {
      method: "POST",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async unsave(postId) {
    const res = await fetch(`${API_BASE}/${postId}/save`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async share(postId, shareMessage = "", shareType = "FEED") {
    const res = await fetch(`${API_BASE}/${postId}/share`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ shareType, shareMessage }),
    });
    return handleResponse(res);
  },

  async hide(postId) {
    const res = await fetch(`${API_BASE}/${postId}/hide`, {
      method: "POST",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  async report(postId, reportType = "INAPPROPRIATE", reason = "") {
    const res = await fetch(`${API_BASE}/${postId}/report`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ reportType, reason }),
    });
    return handleResponse(res);
  },
};

export default postInteractionService;

