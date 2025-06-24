import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('frontend loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Savage/);
    
    // Check that main content is visible
    await expect(page.getByRole('heading', { name: 'Savage' })).toBeVisible();
    await expect(page.getByText('AI-Powered SVG Generator')).toBeVisible();
  });

  test('page has correct structure', async ({ page }) => {
    await page.goto('/');
    
    // Check main element exists
    await expect(page.locator('main')).toBeVisible();
    
    // Check heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Savage');
  });
});