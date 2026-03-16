const mockResponse = {
  vibe_words: [
    'Программист',
    'Техногик',
    'Аналитик',
    'Интроверт',
    'Интеллектуал',
  ],
  image_prompt:
    'A modern tech enthusiast and programmer sitting in a dimly lit, cozy room, surrounded by multiple glowing monitors displaying complex lines of code and data strings. The character wears comfortable dark clothing and a headset, intensely focused on typing on a mechanical keyboard. The environment features subtle cyberpunk elements, a steaming mug of coffee, and soft neon blue and magenta ambient lighting reflecting off their glasses. Cinematic lighting, photorealistic, Unreal Engine 5 render, highly detailed, 8k, volumetric smoke, masterpiece.',
};

export const llmServiceMock = {
  generateYoutubeVibeCheck: async (): Promise<typeof mockResponse> =>
    new Promise((resolve) => setTimeout(() => resolve(mockResponse), 3000)),
};
