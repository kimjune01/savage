import OpenAI from 'openai';
import { logger } from '../server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
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
    throw new Error(`Failed to generate SVG: ${error.message}`);
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

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-vision-preview',
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
          error: error.message
        });
      }
    }

    return results;

  } catch (error) {
    logger.error('Icon set generation error:', error);
    throw new Error(`Failed to generate icon set: ${error.message}`);
  }
}