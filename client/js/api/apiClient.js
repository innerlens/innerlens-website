const API_BASE_URL = 'http://localhost:3000';


const apiClient = {
  //ToDo : update with Vuyo's auth stuff
  token: localStorage.getItem('authToken'),
  
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
    return token;
  },
  
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  },
  
  // Helper - Make API request
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();

    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  // Convenience methods for different HTTP verbs
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },
  
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
};


// Assessment API - Handles all assessment-related endpoints
const assessmentApi = {
  
  async getUserAssessments(userId) {
    return apiClient.get(`/api/assessment/user/${userId}`);
  },
  
  async createAssessment(userId) {
    return apiClient.post('/api/assessment', { user_id: userId });
  },

  async completeAssessment(assessmentId) {
    return apiClient.patch(`/api/assessment/${assessmentId}`, {
      completed_at: new Date().toISOString()
    });
  },
  
  async getAssessmentResults(assessmentId) {
    return apiClient.get(`/result/${assessmentId}`);
  },
  
  async getPersonalityCodeInfo(personalityCode) {
    return apiClient.get(`/code/${personalityCode}`);
  }
};

// Question API - Handles questions and answers
const questionApi = {
  async getQuestionsWithOptions() {
    return apiClient.get('/api/question?includeOptions=true');
  },
  
  async submitAnswer(assessmentId, questionId, questionOptionId) {
    return apiClient.post('/api/response', {
      assessment_id: assessmentId,
      question_id: questionId,
      question_option_id: questionOptionId
    });
  },
  
  async getAnsweredQuestions(assessmentId) {
    return apiClient.get(`/api/response/${assessmentId}`);
  }
};


// Integrated Assessment Flow Controller
const assessmentFlow = {
  async initialize(userId) {
    try {
      // Get user's assessments
      const assessments = await assessmentApi.getUserAssessments(userId);
      
      const ongoingAssessment = assessments.find(a => !a.completed_at);
      
      if (ongoingAssessment) {
        // Return ongoing assessment
        const question = await this.getNextQuestion(ongoingAssessment.id);
        
        return {
          status: 'ongoing',
          assessment: ongoingAssessment,
          question
        };
        

      } else if (assessments.length > 0) {
        // Has completed assessments
        const results = await this.getResults(assessments.id);

        return {
          status: 'completed',
          assessments: assessments,
          results
        };
      } else {
        // No assessments, create new one
        const newAssessment = await assessmentApi.createAssessment(userId);
        return {
          status: 'new',
          assessment: newAssessment
        };
      }
    } catch (error) {
      console.error('Error initializing assessment flow:', error);
      throw error;
    }
  },
  
  // Get next question to answer for ongoing assessment
  async getNextQuestion(assessmentId) {
    try {
      const allQuestions = await questionApi.getQuestionsWithOptions();
      
      // Get already answered questions for this assessment
      const answeredQuestions = await questionApi.getAnsweredQuestions(assessmentId);
      const answeredQuestionIds = answeredQuestions.map(response => response.question_id);
      
      // Find questions that haven't been answered yet
      const unansweredQuestions = allQuestions.filter(
        question => !answeredQuestionIds.includes(question.id)
      );
      
      // All questions answered
      if (unansweredQuestions.length === 0) {
        return null; 
      }
      
      // Return a random unanswered question
      return unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
    } catch (error) {
      console.error('Error getting next question:', error);
      throw error;
    }
  },
  
  // Submit answer and get next question
  async answerQuestion(assessmentId, questionId, optionId) {
    try {

      await questionApi.submitAnswer(assessmentId, questionId, optionId);
      
      // Check if there are more questions
      const nextQuestion = await this.getNextQuestion(assessmentId);
      
      if (!nextQuestion) {
        // All questions answered, mark assessment as complete
        await assessmentApi.completeAssessment(assessmentId);
        return {
          status: 'completed',
          assessmentId
        };
      }
      
      return {
        status: 'ongoing',
        nextQuestion
      };
    } catch (error) {
      console.error('Error answering question:', error);
      throw error;
    }
  },
  
  // Get assessment results
  async getResults(assessmentId) {
    try {
      const results = await assessmentApi.getAssessmentResults(assessmentId);
      
      // Get detailed information about the personality code
      const personalityInfo = await assessmentApi.getPersonalityCodeInfo(results.personality_code);
      
      return {
        results,
        personalityInfo
      };
    } catch (error) {
      console.error('Error getting assessment results:', error);
      throw error;
    }
  }
};

export { apiClient, assessmentApi, questionApi, assessmentFlow };