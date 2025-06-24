interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEnvironment(): void {
  const requiredVars = ['OPENAI_API_KEY'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export function validateGenerationRequest(textPrompt?: string, imageFile?: Express.Multer.File): ValidationResult {
  // Must have either text prompt or image
  if (!textPrompt && !imageFile) {
    return {
      isValid: false,
      error: 'Either text prompt or image is required'
    };
  }

  // Text prompt validation
  if (textPrompt && textPrompt.trim().length < 10) {
    return {
      isValid: false,
      error: 'Please enter at least 10 characters'
    };
  }

  // Image file validation
  if (imageFile) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return {
        isValid: false,
        error: 'Please upload a JPEG, PNG, or WebP image'
      };
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (imageFile.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 20MB'
      };
    }
  }

  return { isValid: true };
}

export function validateIconSetRequest(
  stylePrompt?: string, 
  iconConcepts?: any[], 
  referenceIcon?: Express.Multer.File
): ValidationResult {
  
  // Must have style prompt
  if (!stylePrompt || stylePrompt.trim().length < 5) {
    return {
      isValid: false,
      error: 'Style prompt must be at least 5 characters'
    };
  }

  // Must have icon concepts
  if (!iconConcepts || !Array.isArray(iconConcepts) || iconConcepts.length === 0) {
    return {
      isValid: false,
      error: 'At least one icon concept is required'
    };
  }

  // Validate icon concepts structure
  for (const concept of iconConcepts) {
    if (!concept.name || !concept.description) {
      return {
        isValid: false,
        error: 'Each icon concept must have a name and description'
      };
    }
  }

  // Limit number of icons to prevent abuse
  if (iconConcepts.length > 20) {
    return {
      isValid: false,
      error: 'Maximum 20 icons can be generated at once'
    };
  }

  // Reference icon validation (if provided)
  if (referenceIcon) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(referenceIcon.mimetype)) {
      return {
        isValid: false,
        error: 'Reference icon must be JPEG, PNG, WebP, or SVG'
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (referenceIcon.size > maxSize) {
      return {
        isValid: false,
        error: 'Reference icon must be less than 10MB'
      };
    }
  }

  return { isValid: true };
}