const API_BASE_URL = 'http://localhost:8080/api/v1/social/activity';

const getToken = () => localStorage.getItem('accessToken');
const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export async function getActivityFeed(page = 0, size = 10) {
  const res = await fetch(`${API_BASE_URL}/feed?page=${page}&size=${size}`, {
    headers: getHeaders(),
  });
  return res.json();
}

// Optional: demo endpoint to create activity for current user
export async function createMyActivity(activityType, courseTitle, message = '', courseId = null) {
  const res = await fetch(`${API_BASE_URL}/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ activityType, courseId, courseTitle, message }),
  });
  return res.json();
}






