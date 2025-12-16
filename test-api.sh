#!/bin/bash

# ============================================
# Script Test API UpNestEdu
# ============================================
# Sử dụng: bash test-api.sh
# Hoặc: chmod +x test-api.sh && ./test-api.sh

BASE_URL="http://localhost:8080"
TOKEN=""

echo "🚀 Bắt đầu test API UpNestEdu..."
echo ""

# ============================================
# 1. TEST LOGIN (STUDENT - Không 2FA)
# ============================================
echo "📝 Test 1: Login với student@upnest.edu"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@upnest.edu",
    "password": "123456"
  }')

echo "Response: $RESPONSE"
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login thất bại!"
  exit 1
fi

echo "✅ Login thành công! Token: ${TOKEN:0:50}..."
echo ""

# ============================================
# 2. TEST GET COURSES
# ============================================
echo "📝 Test 2: Lấy danh sách khóa học"
curl -s -X GET "$BASE_URL/api/v1/courses" \
  -H "Authorization: Bearer $TOKEN" | jq '.' || echo "Response (raw):"
curl -s -X GET "$BASE_URL/api/v1/courses" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# ============================================
# 3. TEST FORUM - GET CATEGORIES
# ============================================
echo "📝 Test 3: Lấy danh mục Forum"
curl -s -X GET "$BASE_URL/api/v1/forum/categories" \
  -H "Authorization: Bearer $TOKEN" | jq '.' || echo "Response (raw):"
curl -s -X GET "$BASE_URL/api/v1/forum/categories" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# ============================================
# 4. TEST FORUM - GET THREADS
# ============================================
echo "📝 Test 4: Lấy threads theo category (ID=1)"
curl -s -X GET "$BASE_URL/api/v1/forum/categories/1/threads" \
  -H "Authorization: Bearer $TOKEN" | jq '.' || echo "Response (raw):"
curl -s -X GET "$BASE_URL/api/v1/forum/categories/1/threads" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# ============================================
# 5. TEST STUDY GROUPS
# ============================================
echo "📝 Test 5: Lấy danh sách Study Groups"
curl -s -X GET "$BASE_URL/api/v1/groups" \
  -H "Authorization: Bearer $TOKEN" | jq '.' || echo "Response (raw):"
curl -s -X GET "$BASE_URL/api/v1/groups" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# ============================================
# 6. TEST SOCIAL - GET FOLLOWING
# ============================================
echo "📝 Test 6: Lấy danh sách đang theo dõi"
curl -s -X GET "$BASE_URL/api/v1/social/friends/following" \
  -H "Authorization: Bearer $TOKEN" | jq '.' || echo "Response (raw):"
curl -s -X GET "$BASE_URL/api/v1/social/friends/following" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# ============================================
# 7. TEST SOCIAL - ACTIVITIES
# ============================================
echo "📝 Test 7: Lấy activity feed (userId=2)"
curl -s -X GET "$BASE_URL/api/v1/social/activities/friends/2" \
  -H "Authorization: Bearer $TOKEN" | jq '.' || echo "Response (raw):"
curl -s -X GET "$BASE_URL/api/v1/social/activities/friends/2" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# ============================================
# 8. TEST Q&A - GET QUESTIONS
# ============================================
echo "📝 Test 8: Lấy danh sách câu hỏi Q&A"
curl -s -X GET "$BASE_URL/api/qa/questions?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN" | jq '.' || echo "Response (raw):"
curl -s -X GET "$BASE_URL/api/qa/questions?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo "✅ Hoàn thành test!"
echo "Token để dùng cho các request khác: $TOKEN"
