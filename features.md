Feature: AI-Powered SVG Generation
  As a user of the AI-Powered SVG Generator
  I want to create SVG graphics using text prompts and/or reference images
  So that I can generate scalable vector graphics for my projects

  Background:
    Given I am on the SVG generator homepage
    And the OpenAI API is available
    And I have an active internet connection

  Scenario: Generate SVG from text prompt only
    Given I am on the generation page
    When I enter "A minimalist mountain landscape with a sunset" in the text prompt field
    And I click the "Generate" button
    Then I should see a loading indicator
    And within 60 seconds I should see a generated SVG preview
    And the SVG should contain mountain and sunset elements
    And I should see export options below the preview

  Scenario: Generate SVG from image upload only
    Given I am on the generation page
    When I upload a JPEG image file that is 2MB in size
    Then I should see an image preview
    When I click the "Generate" button
    Then I should see a loading indicator
    And within 60 seconds I should see a generated SVG preview
    And the SVG should reflect the style of the uploaded image

  Scenario: Generate SVG from combined text and image inputs
    Given I am on the generation page
    When I enter "Make this into a cartoon style" in the text prompt field
    And I upload a PNG image file
    Then I should see both the text prompt and image preview
    When I click the "Generate" button
    Then I should see a loading indicator
    And within 60 seconds I should see a generated SVG preview
    And the SVG should combine the image style with the text instructions

  Scenario: Handle invalid text input
    Given I am on the generation page
    When I enter "Hi" in the text prompt field
    And I click the "Generate" button
    Then I should see an error message "Please enter at least 10 characters"
    And the Generate button should remain disabled

  Scenario: Handle file upload with invalid format
    Given I am on the generation page
    When I try to upload a GIF file
    Then I should see an error message "Please upload a JPEG, PNG, or WebP image"
    And the file should not be uploaded

  Scenario: Handle oversized file upload
    Given I am on the generation page
    When I try to upload a file larger than 20MB
    Then I should see an error message "File size must be less than 20MB"
    And I should see a suggestion to "Please upload a smaller image"

Feature: File Upload Interface
  As a user
  I want to easily upload reference images
  So that I can use them for SVG generation

  Scenario: Drag and drop file upload
    Given I am on the generation page
    When I drag a PNG file over the upload area
    Then I should see visual feedback indicating the drop zone is active
    When I drop the file
    Then I should see the file name and size displayed
    And I should see an image preview thumbnail
    And I should see a "Remove" button to clear the upload

  Scenario: Click to browse file upload
    Given I am on the generation page
    When I click on the upload area
    Then the file browser should open
    When I select a JPEG file
    Then I should see the file name and size displayed
    And I should see an image preview thumbnail

  Scenario: Replace uploaded image
    Given I have already uploaded an image
    When I upload a different image
    Then the previous image should be replaced
    And I should see the new image preview

Feature: SVG Preview and Interaction
  As a user
  I want to preview and interact with generated SVGs
  So that I can evaluate the results before exporting

  Scenario: View generated SVG
    Given I have successfully generated an SVG
    Then I should see the SVG rendered in the preview area
    And I should see zoom controls (Fit, 100%, 200%)
    And I should see a "View Code" toggle button
    And I should see basic SVG statistics (elements count, file size)

  Scenario: Zoom SVG preview
    Given I have an SVG in the preview area
    When I click the "200%" zoom button
    Then the SVG should be displayed at 200% size
    And I should be able to pan around the enlarged view
    When I click the "Fit" button
    Then the SVG should fit within the preview area

  Scenario: View SVG source code
    Given I have an SVG in the preview area
    When I click the "View Code" toggle
    Then I should see the SVG source code with syntax highlighting
    And I should be able to scroll through the code
    When I click the toggle again
    Then I should return to the visual preview

Feature: Export Functionality
  As a user
  I want to export my generated SVGs in different formats
  So that I can use them in my projects

  Scenario: Download SVG file
    Given I have a generated SVG in the preview
    When I click the "Download SVG" button
    Then a file download should start
    And the downloaded file should be a valid SVG
    And the filename should be "generated-svg-[timestamp].svg"

  Scenario: Export as PNG
    Given I have a generated SVG in the preview
    When I select "PNG" from the export format dropdown
    And I select "2x" resolution
    And I click "Export"
    Then I should see a loading indicator
    And within 30 seconds a PNG file should download
    And the PNG should be at 2x the original SVG dimensions

  Scenario: Export as JPEG with background color
    Given I have a generated SVG in the preview
    When I select "JPEG" from the export format dropdown
    And I set the background color to white
    And I set the quality to 90%
    And I click "Export"
    Then I should see a loading indicator
    And within 30 seconds a JPEG file should download
    And the JPEG should have a white background

  Scenario: Copy SVG code to clipboard
    Given I have a generated SVG in the preview
    When I click the "Copy Code" button
    Then I should see a "Copied!" confirmation message
    And the SVG code should be copied to my clipboard
    And I should be able to paste it elsewhere

Feature: Icon Set Generation
  As a designer or developer
  I want to generate a cohesive set of icons based on one reference icon and custom prompts
  So that I can create consistent icon families for my projects

  Background:
    Given I am on the icon set generation page
    And the OpenAI API is available

  Scenario: Generate icon set from reference icon and prompt list
    Given I upload a reference icon "home-icon.svg"
    And I enter a custom style prompt "Make it minimalist with thin lines"
    And I provide a list of icon concepts:
      | Icon Name | Description |
      | user      | Person silhouette |
      | settings  | Gear or cog wheel |
      | search    | Magnifying glass |
      | heart     | Heart shape |
      | star      | Five-pointed star |
    When I click "Generate Icon Set"
    Then I should see a progress indicator showing "Generating 5 icons..."
    And within 5 minutes I should see all 5 generated icons
    And each icon should maintain the style of the reference icon
    And each icon should reflect its specific description
    And all icons should have consistent visual properties (stroke width, style, proportions)

  Scenario: Add individual icons to existing set
    Given I have generated an initial icon set of 3 icons
    When I enter a new icon concept "calendar with monthly view"
    And I click "Add to Set"
    Then I should see a loading indicator
    And within 60 seconds the new icon should appear in the set
    And the new icon should match the style of existing icons in the set

  Scenario: Customize icon set generation parameters
    Given I am setting up a new icon set generation
    When I upload a reference icon
    And I set the style prompt to "Bold filled shapes with rounded corners"
    And I set the icon size to "24x24 pixels"
    And I set the stroke width to "2px"
    And I enable "consistent color palette"
    And I provide my icon concept list
    Then all generated icons should follow these specifications
    And I should see the parameters applied consistently across all icons

  Scenario: Preview icon set variations
    Given I have uploaded a reference icon and entered style parameters
    When I click "Preview Style"
    Then I should see 3 sample icons generated with the current settings
    And I should be able to adjust the style prompt
    And I should see the preview update with new style parameters
    When I'm satisfied with the preview
    And I click "Generate Full Set"
    Then the full icon set should be generated using the finalized style

  Scenario: Handle batch generation with mixed results
    Given I am generating an icon set of 8 icons
    When 6 icons generate successfully but 2 fail
    Then I should see the 6 successful icons displayed
    And I should see error indicators for the 2 failed icons
    And I should see "Retry Failed" buttons for the failed icons
    When I click "Retry Failed"
    Then only the failed icons should be regenerated
    And I should maintain the successful icons

  Scenario: Export complete icon set
    Given I have successfully generated a set of 6 icons
    When I click "Export Icon Set"
    Then I should see export options:
      | Format | Description |
      | SVG Bundle | ZIP file with individual SVG files |
      | Icon Font | TTF/WOFF font file |
      | Sprite Sheet | Single SVG with symbol definitions |
      | PNG Pack | ZIP with PNG files at multiple sizes |
    When I select "SVG Bundle" and click "Download"
    Then I should receive a ZIP file containing 6 SVG files
    And each file should be named according to the icon concept
    And all files should maintain consistent styling

  Scenario: Validate icon set consistency
    Given I have generated an icon set
    When I view the consistency analysis
    Then I should see metrics for:
      | Metric | Description |
      | Stroke Width | Consistency of line weights |
      | Style Adherence | How well icons match reference |
      | Size Consistency | Uniform sizing across icons |
      | Visual Balance | Overall visual harmony |
    And I should see a consistency score out of 100
    And I should see suggestions for improving consistency

  Scenario: Handle reference icon style extraction
    Given I upload a reference icon from Font Awesome
    When the system analyzes the reference icon
    Then I should see extracted style properties:
      | Property | Value |
      | Style Type | Line/Filled/Outlined |
      | Stroke Width | 1.5px |
      | Corner Style | Sharp/Rounded |
      | Complexity | Simple/Detailed |
    And these properties should be automatically applied to the generation prompt
    And I should be able to modify these extracted properties

  Scenario: Generate icons with semantic relationships
    Given I upload a "home" icon as reference
    And I enter the style prompt "Consistent with home theme"
    When I request related icons for "real estate application"
    Then the system should suggest related icon concepts:
      | Icon | Relationship |
      | key | Access/Security |
      | door | Entry/Exit |
      | garage | Property type |
      | garden | Outdoor space |
      | blueprint | Planning |
    And I should be able to select from these suggestions
    And I should be able to add my own custom concepts

Feature: Responsive Design and Accessibility
  As a user on different devices
  I want the application to work well on mobile and desktop
  So that I can generate SVGs from any device

  Scenario: Mobile layout adaptation
    Given I am using a mobile device with screen width less than 768px
    When I visit the generation page
    Then the layout should stack vertically
    And all buttons should be touch-friendly (minimum 44px height)
    And the upload area should be appropriately sized for mobile

  Scenario: Dark mode toggle
    Given I am on any page of the application
    When I click the dark mode toggle
    Then the entire interface should switch to dark theme
    And the SVG preview background should adapt accordingly
    And my preference should be saved for future visits

  Scenario: Keyboard navigation
    Given I am using keyboard navigation
    When I press Tab to navigate through the interface
    Then all interactive elements should be focusable
    And I should see clear focus indicators
    And I should be able to activate buttons with Enter or Space

Feature: Error Handling and Recovery
  As a user
  I want clear error messages and recovery options
  So that I can resolve issues and continue using the application

  Scenario: Handle API rate limit
    Given I have made 3 generation requests in the last minute
    When I try to generate another SVG
    Then I should see an error message "Rate limit exceeded. Please wait 1 minute before trying again."
    And I should see a countdown timer
    And the Generate button should be disabled until the limit resets

  Scenario: Handle network failure
    Given my internet connection is interrupted
    When I try to generate an SVG
    Then I should see an error message "Network error. Please check your connection and try again."
    And I should see a "Retry" button
    When my connection is restored and I click "Retry"
    Then the generation should proceed normally

  Scenario: Handle malformed API response
    Given the OpenAI API returns invalid SVG code
    When I try to generate an SVG
    Then I should see an error message "Generation failed. Please try again with a different prompt."
    And I should see a "Try Again" button
    And my input should remain in the form fields

  Scenario: Handle API service downtime
    Given the OpenAI API is temporarily unavailable
    When I try to generate an SVG
    Then I should see an error message "Service temporarily unavailable. Please try again in a few minutes."
    And I should see an estimated restoration time if available