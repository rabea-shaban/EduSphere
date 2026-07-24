import https from 'https';

export interface IAiResponse {
  text: string;
  tokensUsed: number;
}

export interface IAiProvider {
  generateText(prompt: string, systemMessage?: string): Promise<IAiResponse>;
  generateJson<T>(prompt: string, systemMessage?: string): Promise<T>;
  moderateText(input: string): Promise<boolean>;
}

/**
 * OpenAI live API provider.
 */
class OpenAiProvider implements IAiProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  private requestOpenAi(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.apiKey) {
        return reject(new Error('OpenAI API Key is missing. Configure OPENAI_API_KEY in environment.'));
      }

      const postData = JSON.stringify(payload);
      const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (res.statusCode && res.statusCode >= 400) {
              return reject(new Error(parsed.error?.message || 'OpenAI API request failed'));
            }
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.write(postData);
      req.end();
    });
  }

  public async generateText(prompt: string, systemMessage?: string): Promise<IAiResponse> {
    const messages = [];
    if (systemMessage) messages.push({ role: 'system', content: systemMessage });
    messages.push({ role: 'user', content: prompt });

    const response = await this.requestOpenAi({
      model: this.model,
      messages,
      temperature: 0.7,
    });

    return {
      text: response.choices[0].message.content,
      tokensUsed: response.usage?.total_tokens || 100,
    };
  }

  public async generateJson<T>(prompt: string, systemMessage?: string): Promise<T> {
    const messages = [];
    if (systemMessage) messages.push({ role: 'system', content: systemMessage + ' Respond in JSON format only.' });
    messages.push({ role: 'user', content: prompt });

    const response = await this.requestOpenAi({
      model: this.model,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content) as T;
  }

  public async moderateText(input: string): Promise<boolean> {
    // Basic moderation fallback wrapper using gpt model
    try {
      const result = await this.generateJson<{ flagged: boolean }>(
        `Determine if the following content is inappropriate, spam, or contains offensive language. Respond ONLY with a JSON object: { "flagged": boolean }.\n\nContent: "${input}"`,
        'You are a moderation tool.'
      );
      return result.flagged;
    } catch {
      return false; // Safely allow if moderation errors out
    }
  }
}

/**
 * High-quality fallback Mock AI provider.
 */
class MockAiProvider implements IAiProvider {
  public async generateText(prompt: string, _systemMessage?: string): Promise<IAiResponse> {
    let mockResponse = '';

    const lower = prompt.toLowerCase();
    if (lower.includes('hint') || lower.includes('assistant')) {
      mockResponse = `Here is a hint to guide your thinking: Think about the main concept introduced in paragraph 2. Consider how the formula relates force and acceleration. You should check the references on Newton's Laws in your Course Resource Tab! Remember, try to formulate the response yourself first.`;
    } else if (lower.includes('summarize') || lower.includes('summary')) {
      mockResponse = `### Lesson Summary
This lesson introduces the fundamentals of organic chemistry, detailing carbon bonds, structural formulas, and functional group identifiers.

### Key Points
- Carbon forms 4 covalent bonds.
- Hydrocarbons can be saturated (alkanes) or unsaturated (alkenes, alkynes).

### Flashcards
- **Q**: What is the general formula for alkanes?
  **A**: CnH2n+2
- **Q**: What is a functional group?
  **A**: A specific group of atoms responsible for the characteristic chemical reactions of a molecule.

### Important Terms
- **Isomer**: Molecules with the same molecular formula but different structural arrangements.
- **Saturated Hydrocarbon**: Hydrocarbons containing only single covalent bonds.`;
    } else {
      mockResponse = `AI Tutor Response:\n\nThank you for asking! The concept refers to the structural organization of applications into Model-View-Controller components to separate concerns. In our framework, models represent schemas, controllers implement business operations, and routes expose endpoints. Let me know if you need more details!`;
    }

    return {
      text: mockResponse,
      tokensUsed: 120,
    };
  }

  public async generateJson<T>(prompt: string, _systemMessage?: string): Promise<T> {
    const lower = prompt.toLowerCase();
    let resObj: any = {};

    if (lower.includes('quiz')) {
      resObj = {
        quizzes: [
          {
            question: 'What is the primary function of DNA?',
            type: 'MCQ',
            options: ['Protein synthesis', 'Store genetic information', 'Energy production', 'Cell division'],
            correctAnswers: ['Store genetic information'],
          },
          {
            question: 'Water boils at 100 degrees Celsius under standard pressure.',
            type: 'True/False',
            options: ['True', 'False'],
            correctAnswers: ['True'],
          },
          {
            question: 'Define thermodynamics in one sentence.',
            type: 'Short Answer',
            options: [],
            correctAnswers: ['The branch of physics that deals with the relations between heat and other forms of energy.'],
          },
        ],
      };
    } else if (lower.includes('essay') || lower.includes('evaluate')) {
      resObj = {
        grammarScore: 85,
        clarityScore: 90,
        structureScore: 80,
        completenessScore: 88,
        score: 86,
        feedback: 'Overall, the essay is well-argued and structured. The grammar is mostly accurate, though there are minor tense inconsistencies in paragraph 3. The introduction clearly lays out your thesis statement.',
      };
    } else if (lower.includes('plan') || lower.includes('planner')) {
      resObj = {
        studyPlan: [
          { day: 'Monday', subject: 'Mathematics', topic: 'Calculus Limits', duration: '60 mins' },
          { day: 'Wednesday', subject: 'Physics', topic: 'Kinematics', duration: '90 mins' },
          { day: 'Friday', subject: 'Chemistry', topic: 'Molar Calculations', duration: '60 mins' },
        ],
      };
    } else if (lower.includes('recommend') || lower.includes('recommendations')) {
      resObj = {
        courses: [
          { title: 'Advanced Calculus', reason: 'Based on your recent scores in introductory mathematics.' },
          { title: 'Introductory Quantum Physics', reason: 'Recommended based on your interest tags.' },
        ],
      };
    } else {
      resObj = {
        insights: 'The student shows excellent proficiency in algebra but needs interventions in analytical geometry.',
      };
    }

    return resObj as T;
  }

  public async moderateText(input: string): Promise<boolean> {
    const lower = input.toLowerCase();
    // Simple mock filters for offensive words
    return lower.includes('spam') || lower.includes('hate') || lower.includes('abuse');
  }
}

/**
 * AI Provider Factory.
 */
class AiProviderFactory {
  private activeProvider: IAiProvider;

  constructor() {
    if (process.env.AI_PROVIDER === 'openai' && process.env.OPENAI_API_KEY) {
      this.activeProvider = new OpenAiProvider();
    } else {
      this.activeProvider = new MockAiProvider();
    }
  }

  public getProvider(): IAiProvider {
    return this.activeProvider;
  }
}

export const aiProvider = new AiProviderFactory().getProvider();
export default aiProvider;
