/**
 * connectionService - Friends/Followers/Following/Search
 */

const API_BASE_URL = 'http://localhost:8080/api/v1/social/connections';

const getToken = () => localStorage.getItem('accessToken');

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleJson = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }
  return await res.json();
};

export async function searchUsers(q, course = '') {
  const params = new URLSearchParams();
  if (q && q.trim()) params.set('q', q.trim());
  else params.set('q', '');
  if (course && course.trim()) params.set('course', course.trim());

  const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
    headers: authHeaders(),
  });
  return handleJson(res);
}

export async function getFriends() {
  const res = await fetch(`${API_BASE_URL}/friends`, { headers: authHeaders() });
  return handleJson(res);
}

export async function getFollowing() {
  const res = await fetch(`${API_BASE_URL}/following`, { headers: authHeaders() });
  return handleJson(res);
}

export async function getFollowers() {
  const res = await fetch(`${API_BASE_URL}/followers`, { headers: authHeaders() });
  return handleJson(res);
}

export async function followUser(targetId) {
  const res = await fetch(`${API_BASE_URL}/follow/${targetId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleJson(res);
}

export async function unfollowUser(targetId) {
  const res = await fetch(`${API_BASE_URL}/unfollow/${targetId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleJson(res);
}

export async function updateMyPresence({ online, currentCourseTitle } = {}) {
  const res = await fetch(`${API_BASE_URL}/presence`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ online, currentCourseTitle }),
  });
  return handleJson(res);
}


