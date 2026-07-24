import { aiProvider } from '../src/config/ai';
import { cache } from '../src/config/cache';

describe('AI Services & Cache Unit Tests', () => {
  it('should generate text completion from active provider', async () => {
    const result = await aiProvider.generateText('Explain calculus in one sentence');
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('tokensUsed');
    expect(typeof result.text).toBe('string');
    expect(result.tokensUsed).toBeGreaterThan(0);
  });

  it('should generate structured JSON quiz object', async () => {
    const result = await aiProvider.generateJson<{ quizzes: any[] }>('Generate a quiz about physics');
    expect(result).toHaveProperty('quizzes');
    expect(Array.isArray(result.quizzes)).toBe(true);
  });

  it('should set and get values from cache manager', async () => {
    const testKey = 'test_key_123';
    const testValue = 'cached_prompt_response';

    await cache.set(testKey, testValue, 10);
    const retrieved = await cache.get<string>(testKey);

    expect(retrieved).toBe(testValue);
  });
});
