"""
SVG Generation Prompt Template for OpenAI API
"""

def create_svg_generation_prompt(
    prompt: str,
    style: str = "minimalist",
    color_palette: list = None,
    stroke_width: int = 2,
    corner_style: str = "rounded",
    complexity: str = "simple",
    fill_style: str = "filled",
    background: str = "transparent",
    viewbox_padding: int = 10,
    border_style: str = "none",
    background_shape: str = "none",
    reference_image_description: str = None
) -> str:
    """
    Generate a structured prompt for OpenAI API to create SVG graphics.
    
    Args:
        prompt: Main description of what to generate
        style: Visual style (minimalist, detailed, cartoon, realistic, etc.)
        color_palette: List of hex colors to use
        stroke_width: Line thickness (1-5)
        corner_style: "sharp" | "rounded" | "mixed"
        complexity: "simple" | "moderate" | "detailed"
        fill_style: "outline" | "filled" | "mixed"
        background: "transparent" | "solid" | hex color
        viewbox_padding: Padding around main content (0-20)
        border_style: "none" | "circle" | "square" | "rounded_square"
        background_shape: "none" | "circle" | "square" | "rounded_square"
        reference_image_description: Description of reference image if provided
    
    Returns:
        Formatted prompt string for OpenAI API
    """
    
    if color_palette is None:
        color_palette = ["#333333", "#666666", "#999999", "#CCCCCC"]
    
    color_palette_str = ", ".join(color_palette)
    
    reference_section = ""
    if reference_image_description:
        reference_section = f"\n- Reference style: {reference_image_description}"
    
    # Build border and background instructions
    border_section = ""
    if border_style != "none":
        border_section = f"\n- Border style: {border_style} border around the icon"
    
    background_section = ""
    if background_shape != "none":
        background_section = f"\n- Background shape: {background_shape} background behind the icon content"
    
    svg_prompt = f"""Create a clean, scalable SVG graphic with the following specifications:

Main Request: {prompt}

Style Requirements:
- Visual style: {style}
- Complexity level: {complexity}
- Fill approach: {fill_style}
- Corner treatment: {corner_style}
- Stroke width: {stroke_width}px
- Background: {background}
- Viewbox padding: {viewbox_padding}px{border_section}{background_section}{reference_section}

Color Palette (use only these colors):
{color_palette_str}

Technical Requirements:
- Generate valid, optimized SVG code
- Use semantic element names and structure
- Include proper viewBox for scalability
- Ensure accessibility with descriptive titles
- Keep code clean and minimal
- Make sure all paths are properly closed
- Use consistent spacing and indentation

Output only the complete SVG code, starting with <svg> and ending with </svg>."""

    return svg_prompt


def create_icon_set_prompt(
    icon_concepts: list,
    reference_style_description: str,
    style_prompt: str = "consistent minimalist design",
    icon_size: str = "24x24",
    color_palette: list = None,
    stroke_width: int = 2,
    semantic_group: str = "interface",
    visual_weight: str = "regular",
    border_style: str = "none",
    background_shape: str = "none"
) -> str:
    """
    Generate a structured prompt for creating cohesive icon sets.
    
    Args:
        icon_concepts: List of dicts with 'name' and 'description' keys
        reference_style_description: Description of the reference icon style
        style_prompt: Overall style direction
        icon_size: Standard size specification
        color_palette: List of hex colors
        stroke_width: Consistent stroke width
        semantic_group: Category of icons (navigation, actions, etc.)
        visual_weight: Weight of the icons (light, regular, bold)
        border_style: "none" | "circle" | "square" | "rounded_square"
        background_shape: "none" | "circle" | "square" | "rounded_square"
    
    Returns:
        Formatted prompt string for icon set generation
    """
    
    if color_palette is None:
        color_palette = ["#333333", "#666666"]
    
    color_palette_str = ", ".join(color_palette)
    
    icon_list = "\n".join([f"- {icon['name']}: {icon['description']}" for icon in icon_concepts])
    
    # Build border and background instructions for icon set
    border_instruction = ""
    if border_style != "none":
        border_instruction = f"\n- Border style: Each icon must have a {border_style} border"
    
    background_instruction = ""
    if background_shape != "none":
        background_instruction = f"\n- Background shape: Each icon must have a {background_shape} background shape"
    
    icon_set_prompt = f"""Create a cohesive set of SVG icons with consistent styling:

Reference Style: {reference_style_description}
Style Direction: {style_prompt}

Icons to Generate:
{icon_list}

Design Consistency Requirements:
- Icon size: {icon_size} pixels
- Stroke width: {stroke_width}px consistently across all icons
- Visual weight: {visual_weight}
- Semantic group: {semantic_group}
- Color palette: {color_palette_str}{border_instruction}{background_instruction}

Technical Requirements:
- Each icon should be a complete, valid SVG
- Use consistent viewBox dimensions
- Maintain visual harmony across the set
- Ensure all icons work at small sizes
- Use semantic, descriptive element structure
- Include accessibility attributes

Style Consistency Rules:
- Same stroke width and line endings
- Consistent corner radius treatment
- Uniform optical sizing and balance
- Matching level of detail and complexity
- Coherent visual rhythm and spacing

Generate each icon as a separate, complete SVG code block, clearly labeled with the icon name."""

    return icon_set_prompt