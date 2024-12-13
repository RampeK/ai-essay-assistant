import { EssayRequirements, EssayStructure, TextAnalysis } from '../types/types';
import { EssayType } from '../components/EssayTypeSelector';

console.log('API Key:', import.meta.env.VITE_GROQ_API_KEY);
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroqAPI(messages: any[]) {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('API key not found. Please check your environment variables.');
    }

    console.log('Using API key:', GROQ_API_KEY);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages,
        temperature: 0.7,
        top_p: 1,
        stream: false,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('API Call failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export async function analyzeRequirements(instructions: string, essayType: EssayType): Promise<EssayRequirements> {
  const systemMessage = {
    role: "system",
    content: `You are a helpful assistant that analyzes essay requirements. 
    Analyze requirements specifically for ${essayType} type essays.
    Always return your response as a valid JSON object.`
  };

  const userMessage = {
    role: "user",
    content: `Analyze these essay instructions for a ${essayType} essay and extract the requirements into a JSON object with this exact structure:
    {
      "length": {
        "min": number | null,
        "max": number | null,
        "unit": "words" | "pages"
      },
      "structure": {
        "hasIntroduction": boolean,
        "hasConclusion": boolean,
        "requiredSections": string[]
      },
      "sourceRequirements": {
        "minSources": number | null,
        "sourceTypes": string[]
      },
      "evaluationCriteria": string[],
      "topicLimitations": string[]
    }

    Instructions: ${instructions}`
  };

  try {
    const result = await callGroqAPI([systemMessage, userMessage]);
    console.log('Parsing result:', result);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error in analyzeRequirements:', error);
    throw error;
  }
}

export async function planStructure(requirements: EssayRequirements): Promise<EssayStructure> {
  const systemMessage = {
    role: "system",
    content: `You are an expert academic writing assistant specializing in detailed essay planning.
    Create comprehensive, well-structured essay plans that:
    1. Always include 3-4 main arguments/body paragraphs
    2. Ensure balanced coverage of all aspects of the topic
    3. Maintain logical progression between sections
    4. Address all requirements thoroughly
    5. Follow academic essay structure (introduction, multiple body paragraphs, conclusion)
    
    Each section should be detailed enough to serve as a mini-guide for writing that part of the essay.`
  };

  const userMessage = {
    role: "user",
    content: `Create a detailed essay structure with multiple main arguments (at least 3 body paragraphs).
    Each section must be comprehensive and specific to the topic.
    
    Return a JSON object with this exact structure:
    {
      "introduction": "Detailed paragraph explaining what to include in the introduction (minimum 200 words)",
      "mainArguments": [
        {
          "section": "Clear section title",
          "content": "Comprehensive explanation of what this section should cover (minimum 300 words)"
        },
        {
          "section": "Second main argument title",
          "content": "Detailed guidance for second main argument (minimum 300 words)"
        },
        {
          "section": "Third main argument title",
          "content": "Detailed guidance for third main argument (minimum 300 words)"
        }
      ],
      "conclusion": "Detailed explanation of how to conclude the essay effectively (minimum 200 words)"
    }

    Requirements: ${JSON.stringify(requirements)}
    
    Important guidelines:
    1. Generate at least 3 distinct main arguments
    2. Each main argument should focus on a different aspect of the topic
    3. Ensure logical flow and progression between arguments
    4. Include specific guidance about evidence and examples for each section
    5. Maintain balance between different viewpoints or aspects
    6. Provide clear writing directions for each section
    
    Make the structure detailed and comprehensive, suitable for a full academic essay.`
  };

  try {
    const result = await callGroqAPI([systemMessage, userMessage]);
    console.log('Parsing structure result:', result);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error in planStructure:', error);
    throw error;
  }
}

export async function analyzeText(text: string, requirements: EssayRequirements): Promise<TextAnalysis> {
  const systemMessage = {
    role: "system",
    content: `You are an expert essay analyzer. Provide clear, constructive feedback on essays.
    Compare the essay against the given requirements and provide:
    1. A comprehensive analysis of how well the essay meets the requirements
    2. Specific suggestions for improvement
    
    Keep the tone constructive and focus on the most important aspects.`
  };

  const userMessage = {
    role: "user",
    content: `Analyze this essay against the given requirements.
    Provide thoughtful feedback focusing on both strengths and areas for improvement.
    
    Return a JSON object with this structure:
    {
      "feedback": {
        "generalFeedback": "A comprehensive analysis of the essay, discussing how well it meets requirements",
        "suggestions": ["Specific, actionable suggestions for improvement"]
      }
    }

    Requirements: ${JSON.stringify(requirements)}
    Essay Text: ${text}`
  };

  try {
    const result = await callGroqAPI([systemMessage, userMessage]);
    console.log('Parsing analysis result:', result);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error in analyzeText:', error);
    throw error;
  }
}