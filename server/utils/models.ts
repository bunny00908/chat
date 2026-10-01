/**
 * AI Models configuration
 */

export const MODELS = [
  {
    id: 'anthropic/claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    value: 'anthropic/claude-haiku-4.5'
  },
  {
    id: 'google/gemini-3-flash',
    name: 'Gemini 3 Flash',
    provider: 'Google',
    value: 'google/gemini-3-flash'
  },
  {
    id: 'openai/gpt-5-nano',
    name: 'GPT-5 Nano',
    provider: 'OpenAI',
    value: 'openai/gpt-5-nano'
  }
]

export function isValidModel(model: string): boolean {
  return MODELS.some(m => m.value === model)
}
