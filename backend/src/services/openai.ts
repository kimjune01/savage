import OpenAI from 'openai';
// Simple logger replacement
const logger = {
  error: (message: string, error?: any) => {
    console.error(message, error);
  }
};

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface IconConcept {
  name: string;
  description: string;
}

interface IconSetParams {
  stylePrompt: string;
  iconConcepts: IconConcept[];
  referenceIcon?: string; // base64 encoded image
  iconSize?: string;
  strokeWidth?: string;
  colorPalette?: string;
}

interface GeneratedIcon {
  name: string;
  svg: string;
  success: boolean;
  error?: string;
}

export async function generateSVG(textPrompt: string, imageData?: string): Promise<string> {
  // Mock implementation for development/testing
  if (!openai) {
    console.log('Using mock SVG generation (no OpenAI API key found)');
    
    // Generate a simple mock SVG based on the prompt
    const mockSvgs = {
      'sun': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="#ffeb3b" stroke="#ff9800" stroke-width="2"/><g stroke="#ff9800" stroke-width="3"><line x1="50" y1="10" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="90"/><line x1="10" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="90" y2="50"/><line x1="21.5" y1="21.5" x2="28.5" y2="28.5"/><line x1="71.5" y1="71.5" x2="78.5" y2="78.5"/><line x1="71.5" y1="28.5" x2="78.5" y2="21.5"/><line x1="21.5" y1="78.5" x2="28.5" y2="71.5"/></g></svg>',
      'star': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,15 61,35 85,35 67,50 73,75 50,60 27,75 33,50 15,35 39,35" fill="#ffd700" stroke="#ffb300" stroke-width="2"/></svg>',
      'heart': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,85 C50,85 20,60 20,40 C20,25 30,15 45,20 C47,21 50,25 50,25 C50,25 53,21 55,20 C70,15 80,25 80,40 C80,60 50,85 50,85 Z" fill="#e91e63" stroke="#c2185b" stroke-width="2"/></svg>',
      'tree': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="45" y="60" width="10" height="25" fill="#8d6e63"/><circle cx="50" cy="40" r="25" fill="#4caf50" stroke="#388e3c" stroke-width="2"/></svg>',
      'house': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,20 20,50 80,50" fill="#f44336" stroke="#d32f2f" stroke-width="2"/><rect x="30" y="50" width="40" height="30" fill="#ffeb3b" stroke="#fbc02d" stroke-width="2"/><rect x="40" y="60" width="8" height="12" fill="#8d6e63"/><rect x="52" y="60" width="8" height="8" fill="#2196f3"/></svg>'
    };

    // Find a matching mock SVG or create a generic one
    const promptLower = textPrompt.toLowerCase();
    for (const [key, svg] of Object.entries(mockSvgs)) {
      if (promptLower.includes(key)) {
        return svg;
      }
    }

    // Generic circle SVG if no match found
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#2196f3" stroke="#1976d2" stroke-width="3"/><text x="50" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="8">${textPrompt.substring(0, 10)}</text></svg>`;
  }

  try {
    const messages: any[] = [
      {
        role: 'system',
        content: `You are an expert SVG creator. Generate clean, scalable SVG code based on the user's requirements. 
        
        Requirements:
        - Return only valid SVG code
        - Use viewBox for scalability
        - Keep the code clean and well-structured
        - Use semantic element names when possible
        - Optimize for web use
        - Include proper xmlns declaration`
      }
    ];

    // Add user message with text prompt
    if (imageData && textPrompt) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Create an SVG based on this image and the following instructions: ${textPrompt}`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${imageData}`
            }
          }
        ]
      });
    } else if (imageData) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Create an SVG based on this image, maintaining its key visual elements and style.'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${imageData}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: `Create an SVG for: ${textPrompt}`
      });
    }

    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }

    const completion = await openai.chat.completions.create({
      model: imageData ? 'gpt-4o' : 'gpt-4o',
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Extract SVG code from response
    const svgMatch = response.match(/<svg[\s\S]*?<\/svg>/i);
    if (!svgMatch) {
      throw new Error('No valid SVG found in response');
    }

    return svgMatch[0];

  } catch (error) {
    logger.error('OpenAI SVG generation error:', error);
    throw new Error(`Failed to generate SVG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateIconSet(params: IconSetParams): Promise<GeneratedIcon[]> {
  const results: GeneratedIcon[] = [];
  
  try {
    const { stylePrompt, iconConcepts, referenceIcon, iconSize, strokeWidth, colorPalette } = params;

    // Build the system prompt for icon generation
    const systemPrompt = `You are an expert icon designer. Create consistent SVG icons based on the provided style guidelines.

    Style Requirements:
    - Size: ${iconSize || '24x24 pixels'}
    - Stroke width: ${strokeWidth || '2px'}
    - Color palette: ${colorPalette || 'monochrome'}
    - Style: ${stylePrompt}
    ${referenceIcon ? '- Match the style of the reference icon provided' : ''}
    
    Technical Requirements:
    - Return only valid SVG code
    - Use viewBox="0 0 24 24" for consistency
    - Keep icons simple and recognizable at small sizes
    - Use consistent stroke width and styling
    - Optimize for clarity and scalability`;

    // Generate icons one by one to maintain consistency
    for (const concept of iconConcepts) {
      try {
        const messages: any[] = [
          {
            role: 'system',
            content: systemPrompt
          }
        ];

        if (referenceIcon) {
          messages.push({
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Create an icon for "${concept.name}" - ${concept.description}. Match the style of this reference icon:`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${referenceIcon}`
                }
              }
            ]
          });
        } else {
          messages.push({
            role: 'user',
            content: `Create an icon for "${concept.name}" - ${concept.description}`
          });
        }

        if (!openai) {
          throw new Error('OpenAI client not initialized');
        }

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages,
          max_tokens: 1000,
          temperature: 0.3, // Lower temperature for more consistent results
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
          throw new Error('No response from OpenAI');
        }

        // Extract SVG code from response
        const svgMatch = response.match(/<svg[\s\S]*?<\/svg>/i);
        if (!svgMatch) {
          throw new Error('No valid SVG found in response');
        }

        results.push({
          name: concept.name,
          svg: svgMatch[0],
          success: true
        });

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        logger.error(`Error generating icon for ${concept.name}:`, error);
        results.push({
          name: concept.name,
          svg: '',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;

  } catch (error) {
    logger.error('Icon set generation error:', error);
    throw new Error(`Failed to generate icon set: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}