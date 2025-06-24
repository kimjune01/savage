# AI Image Generation Tool Call Prompt

## Core Parameters for SVG Generation

### Required Parameters:

- **prompt** (string): The main text description of what to generate
- **style** (string): Visual style specification (minimalist, detailed, cartoon, realistic, etc.)
- **format** (string): Always "svg" for this application
- **dimensions** (object): { width: number, height: number } in pixels
- **color_palette** (array): List of hex colors to use (e.g., ["#FF5733", "#33FF57", "#3357FF"])

### Optional Enhancement Parameters:

- **reference_image_url** (string): URL to reference image if provided
- **stroke_width** (number): Line thickness in pixels (1-5)
- **corner_style** (string): "sharp" | "rounded" | "mixed"
- **complexity** (string): "simple" | "moderate" | "detailed"
- **fill_style** (string): "outline" | "filled" | "mixed"
- **background** (string): "transparent" | "solid" | hex color
- **viewbox_padding** (number): Padding around main content (0-20)

### Icon Set Specific Parameters:

- **icon_size** (string): Standard size like "24x24", "32x32", "48x48"
- **consistency_reference** (string): Base64 encoded reference icon
- **semantic_group** (string): Category like "navigation", "actions", "status"
- **stroke_consistency** (boolean): Maintain consistent stroke weights
- **visual_weight** (string): "light" | "regular" | "bold"

### Quality Control Parameters:

- **svg_optimization** (boolean): Optimize SVG code for smaller file size
- **accessibility** (boolean): Include proper ARIA labels and descriptions
- **scalability_test** (boolean): Ensure crisp rendering at multiple sizes
- **validation** (boolean): Validate SVG syntax before returning

## Example Tool Call Structure:

```json
{
  "tool_name": "generate_svg",
  "parameters": {
    "prompt": "A minimalist mountain landscape with a sunset",
    "style": "minimalist",
    "format": "svg",
    "dimensions": {
      "width": 400,
      "height": 300
    },
    "color_palette": ["#FF6B35", "#F7931E", "#FFD23F", "#06D6A0"],
    "stroke_width": 2,
    "corner_style": "rounded",
    "complexity": "simple",
    "fill_style": "filled",
    "background": "transparent",
    "viewbox_padding": 10,
    "svg_optimization": true,
    "accessibility": true,
    "scalability_test": true,
    "validation": true
  }
}
```

## Icon Set Generation Tool Call:

```json
{
  "tool_name": "generate_icon_set",
  "parameters": {
    "reference_icon": "base64_encoded_svg_data",
    "style_prompt": "Bold filled shapes with rounded corners",
    "icon_concepts": [
      { "name": "user", "description": "Person silhouette" },
      { "name": "settings", "description": "Gear or cog wheel" },
      { "name": "search", "description": "Magnifying glass" }
    ],
    "icon_size": "24x24",
    "color_palette": ["#333333", "#666666", "#999999"],
    "stroke_width": 2,
    "consistency_reference": "base64_reference_icon",
    "semantic_group": "interface",
    "stroke_consistency": true,
    "visual_weight": "regular",
    "svg_optimization": true,
    "accessibility": true
  }
}
```

## Response Format:

The AI should return structured data including:

- Generated SVG code
- Metadata (dimensions, colors used, element count)
- Optimization suggestions
- Accessibility compliance status
- Error handling information
