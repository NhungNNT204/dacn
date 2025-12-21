/**
 * Gemini AI Service
 * Tích hợp với Google Gemini API để tạo lộ trình học tập cá nhân hóa
 */

// Ưu tiên: localStorage > environment variable
const GEMINI_API_KEY = 
  localStorage.getItem('gemini_api_key') || 
  import.meta.env.VITE_GEMINI_API_KEY || 
  'AIzaSyBhAC6gafl3I-VRiJDy44yxrwXayu0Njho';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Gọi Gemini API để tạo lộ trình học tập
 * @param {Object} params - Thông tin sinh viên và career path
 * @param {string} params.careerPath - Tên career path (e.g., "Business Analyst", "UI/UX Designer")
 * @param {string} params.pathCode - Mã career path (e.g., "ba", "uiux")
 * @param {Object} params.userInfo - Thông tin sinh viên
 * @param {number} params.stepIndex - Index của chặng cần khám phá (0-based)
 * @param {Object} params.currentStep - Thông tin chặng hiện tại
 * @returns {Promise<Object>} - Lộ trình chi tiết được AI tạo
 */
export const generateLearningRoadmap = async ({
  careerPath,
  pathCode,
  userInfo,
  stepIndex,
  currentStep
}) => {
  // Lấy API key mới nhất (có thể đã được update trong localStorage)
  const apiKey = localStorage.getItem('gemini_api_key') || 
                 import.meta.env.VITE_GEMINI_API_KEY || 
                 'AIzaSyBhAC6gafl3I-VRiJDy44yxrwXayu0Njho';
  
  // Nếu không có API key, sử dụng fallback
  if (!apiKey || apiKey === '') {
    console.warn('Gemini API key not found, using fallback data');
    return generateFallbackRoadmap(careerPath, pathCode, stepIndex, currentStep);
  }

  try {
    // Tạo prompt cho Gemini
    const prompt = createPromptForGemini({
      careerPath,
      pathCode,
      userInfo,
      stepIndex,
      currentStep
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Parse JSON từ response của Gemini
    return parseGeminiResponse(generatedText, careerPath, pathCode, stepIndex, currentStep);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback nếu API lỗi
    return generateFallbackRoadmap(careerPath, pathCode, stepIndex, currentStep);
  }
};

/**
 * Tạo prompt chi tiết cho Gemini
 */
const createPromptForGemini = ({ careerPath, pathCode, userInfo, stepIndex, currentStep }) => {
  const userName = userInfo?.fullName || 'sinh viên';
  const userLevel = userInfo?.level || 1;
  const userSkills = userInfo?.skills || [];

  return `Bạn là AI chuyên gia tư vấn lộ trình học tập cho nền tảng giáo dục UpNest.Edu.

**Thông tin sinh viên:**
- Tên: ${userName}
- Cấp độ: ${userLevel}
- Kỹ năng hiện có: ${userSkills.join(', ') || 'Đang xây dựng'}

**Career Path:** ${careerPath} (Code: ${pathCode})
**Chặng hiện tại:** ${currentStep?.title || `Chặng ${stepIndex + 1}`}

**Yêu cầu:**
Tạo lộ trình học tập chi tiết cho chặng này, bao gồm:
1. Danh sách bài học/task cụ thể (3-5 items)
2. Mô tả ngắn gọn về mục tiêu chặng này
3. Kỹ năng sẽ đạt được sau khi hoàn thành
4. Tài nguyên học tập đề xuất (sách, khóa học, videos)
5. Thời gian ước tính để hoàn thành

**Format response (JSON):**
{
  "stepTitle": "Tên chặng",
  "description": "Mô tả ngắn về chặng này",
  "tasks": [
    {
      "title": "Tên task",
      "description": "Mô tả chi tiết",
      "duration": "X giờ/X ngày",
      "resources": ["Link hoặc tên tài nguyên"]
    }
  ],
  "skillsGained": ["Kỹ năng 1", "Kỹ năng 2"],
  "estimatedDuration": "X tháng",
  "nextStepPreview": "Gợi ý chặng tiếp theo"
}

Chỉ trả về JSON, không thêm text khác.`;
};

/**
 * Parse response từ Gemini thành object structured
 */
const parseGeminiResponse = (text, careerPath, pathCode, stepIndex, currentStep) => {
  try {
    // Tìm JSON trong response (Gemini có thể thêm markdown hoặc text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Map tasks thành format của hệ thống
      const tasks = parsed.tasks?.map(t => t.title || t) || [];
      
      return {
        stepTitle: parsed.stepTitle || currentStep?.title || `Chặng ${stepIndex + 1}`,
        description: parsed.description || '',
        tasks: tasks,
        tasksDetail: parsed.tasks || [],
        skillsGained: parsed.skillsGained || [],
        estimatedDuration: parsed.estimatedDuration || '1-2 tháng',
        nextStepPreview: parsed.nextStepPreview || '',
        aiGenerated: true
      };
    }
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
  }
  
  // Nếu không parse được, dùng fallback
  return generateFallbackRoadmap(careerPath, pathCode, stepIndex, currentStep);
};

/**
 * Fallback roadmap khi không có API key hoặc API lỗi
 */
const generateFallbackRoadmap = (careerPath, pathCode, stepIndex, currentStep) => {
  // Roadmap templates theo từng career path và chặng
  const roadmapTemplates = {
    ba: {
      0: {
        stepTitle: 'Nền tảng nghiệp vụ',
        tasks: [
          'Khơi gợi yêu cầu (Elicitation)',
          'Viết User Stories',
          'BPMN 2.0 Cơ bản',
          'Phân tích stakeholders',
          'Tài liệu yêu cầu chức năng (FRD)'
        ],
        description: 'Xây dựng nền tảng vững chắc về nghiệp vụ và phân tích yêu cầu',
        skillsGained: ['Elicitation', 'Documentation', 'Stakeholder Management'],
        estimatedDuration: '2-3 tháng'
      },
      1: {
        stepTitle: 'Phân tích & Thiết kế hệ thống',
        tasks: [
          'Vẽ sơ đồ UML (Use Case, Sequence, Class Diagram)',
          'Database Schema Design',
          'API Documentation (Swagger/OpenAPI)',
          'System Architecture Design',
          'Wireframe & Mockup Design'
        ],
        description: 'Học cách phân tích và thiết kế hệ thống từ yêu cầu nghiệp vụ',
        skillsGained: ['UML Modeling', 'Database Design', 'API Design', 'System Thinking'],
        estimatedDuration: '2-3 tháng'
      },
      2: {
        stepTitle: 'Quản lý sản phẩm (Product)',
        tasks: [
          'Backlog Management & Prioritization',
          'Agile/Scrum Framework',
          'UAT Testing & Test Cases',
          'Product Roadmap Planning',
          'Stakeholder Communication'
        ],
        description: 'Phát triển kỹ năng quản lý sản phẩm và làm việc theo Agile',
        skillsGained: ['Product Management', 'Agile/Scrum', 'Testing', 'Project Management'],
        estimatedDuration: '2-3 tháng'
      },
      3: {
        stepTitle: 'Thực chiến dự án (Internship)',
        tasks: [
          'Làm việc cùng Dev/QC Team',
          'Xử lý Change Requests',
          'Hoàn thiện Portfolio & CV',
          'Presentation Skills',
          'Industry Best Practices'
        ],
        description: 'Áp dụng kiến thức vào dự án thực tế và chuẩn bị cho sự nghiệp',
        skillsGained: ['Real-world Experience', 'Team Collaboration', 'Problem Solving', 'Communication'],
        estimatedDuration: '2-4 tháng'
      }
    },
    uiux: {
      0: {
        stepTitle: 'Fundamentals of Design',
        tasks: [
          'Nguyên lý thiết kế cơ bản (Color, Typography, Layout)',
          'Design Systems & Components',
          'Wireframing & Low-fidelity Prototyping',
          'User Research Methods',
          'Design Tools (Figma, Sketch)'
        ],
        description: 'Nắm vững các nguyên lý thiết kế và công cụ cơ bản',
        skillsGained: ['Design Principles', 'Wireframing', 'User Research', 'Figma'],
        estimatedDuration: '1-2 tháng'
      },
      1: {
        stepTitle: 'UX Design & Research',
        tasks: [
          'User Journey Mapping',
          'Persona Creation',
          'Usability Testing',
          'Information Architecture',
          'Interaction Design Patterns'
        ],
        description: 'Phát triển kỹ năng UX research và thiết kế trải nghiệm người dùng',
        skillsGained: ['UX Research', 'User Testing', 'Information Architecture', 'Interaction Design'],
        estimatedDuration: '2-3 tháng'
      },
      2: {
        stepTitle: 'UI Design & Prototyping',
        tasks: [
          'High-fidelity Design',
          'Interactive Prototyping',
          'Design System Creation',
          'Responsive Design',
          'Animation & Micro-interactions'
        ],
        description: 'Tạo ra các thiết kế UI chuyên nghiệp và prototype tương tác',
        skillsGained: ['UI Design', 'Prototyping', 'Design Systems', 'Animation'],
        estimatedDuration: '2-3 tháng'
      },
      3: {
        stepTitle: 'Portfolio & Career',
        tasks: [
          'Xây dựng Portfolio chuyên nghiệp',
          'Case Studies & Design Process',
          'Client Presentation Skills',
          'Industry Networking',
          'Job Interview Preparation'
        ],
        description: 'Chuẩn bị portfolio và kỹ năng để bắt đầu sự nghiệp UI/UX Designer',
        skillsGained: ['Portfolio Building', 'Presentation', 'Networking', 'Career Skills'],
        estimatedDuration: '1-2 tháng'
      }
    }
  };

  const template = roadmapTemplates[pathCode]?.[stepIndex] || {
    stepTitle: currentStep?.title || `Chặng ${stepIndex + 1}`,
    tasks: currentStep?.tasks || ['Học nội dung chặng này'],
    description: 'Hoàn thành các bài học và task trong chặng này',
    skillsGained: [],
    estimatedDuration: '1-2 tháng'
  };

  return {
    ...template,
    aiGenerated: false
  };
};

/**
 * Lấy API key từ environment hoặc user input
 */
export const setGeminiApiKey = (apiKey) => {
  localStorage.setItem('gemini_api_key', apiKey);
  console.log('Gemini API key đã được cập nhật');
};

export const getGeminiApiKey = () => {
  return localStorage.getItem('gemini_api_key') || 
         import.meta.env.VITE_GEMINI_API_KEY || 
         'AIzaSyBhAC6gafl3I-VRiJDy44yxrwXayu0Njho';
};

// Tự động set API key mặc định nếu chưa có
if (!localStorage.getItem('gemini_api_key') && !import.meta.env.VITE_GEMINI_API_KEY) {
  localStorage.setItem('gemini_api_key', 'AIzaSyBhAC6gafl3I-VRiJDy44yxrwXayu0Njho');
}

