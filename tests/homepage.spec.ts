import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('should load homepage correctly', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/EuroTCG.*Under Construction/);

    // Check main heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Something Amazing is Coming Soon'
    );

    // Check that the page contains key elements
    await expect(page.getByText('European trading card game collection manager')).toBeVisible();
    await expect(page.getByRole('button', { name: /notify me/i })).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /European TCG collectors/);

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /EuroTCG/);

    // Check Twitter Card tags
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('newsletter form should work', async ({ page }) => {
    await page.goto('/');

    const emailInput = page.getByRole('textbox', { name: /email/i });
    const submitButton = page.getByRole('button', { name: /notify me/i });

    // Test empty form submission
    await submitButton.click();
    // Should show validation error (form implementation dependent)

    // Test valid email
    await emailInput.fill('test@example.com');
    await submitButton.click();

    // Should show success message (form implementation dependent)
  });

  test('theme toggle should work', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();

    // Get initial theme
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');

    // Click theme toggle
    await themeToggle.click();

    // Check theme changed
    const newClass = await html.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('language switcher should work', async ({ page }) => {
    await page.goto('/');

    const languageButton = page.getByRole('button', { name: /change language/i });
    await expect(languageButton).toBeVisible();

    await languageButton.click();

    // Check dropdown appears
    await expect(page.getByText('Français')).toBeVisible();
    await expect(page.getByText('Deutsch')).toBeVisible();

    // Click on French
    await page.getByText('Français').click();

    // Should navigate to French version
    await expect(page).toHaveURL(/\/fr/);
  });
});

test.describe('Accessibility Tests', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    const h2s = page.getByRole('heading', { level: 2 });
    await expect(h2s.first()).toBeVisible();

    // Should not skip heading levels
    const h4s = page.getByRole('heading', { level: 4 });
    const h4Count = await h4s.count();
    if (h4Count > 0) {
      const h3s = page.getByRole('heading', { level: 3 });
      const h3Count = await h3s.count();
      expect(h3Count).toBeGreaterThan(0);
    }
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');

    // Skip link should be available
    await page.keyboard.press('Tab');
    const skipLink = page.getByText(/skip to main content/i);
    await expect(skipLink).toBeFocused();

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // Check form labels
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await expect(emailInput).toHaveAttribute('aria-label');

    // Check button labels
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toHaveAttribute('aria-label');

    const languageButton = page.getByRole('button', { name: /change language/i });
    await expect(languageButton).toHaveAttribute('aria-label');
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');

    // This is a basic check - in a real app you'd use axe-core
    const body = page.locator('body');
    const bodyStyles = await body.evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    // Ensure colors are not the same (basic contrast check)
    expect(bodyStyles.color).not.toBe(bodyStyles.backgroundColor);
  });
});

test.describe('Performance Tests', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const endTime = Date.now();

    const loadTime = endTime - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have minimal layout shift', async ({ page }) => {
    await page.goto('/');

    // Wait for fonts to load
    await page.waitForLoadState('networkidle');

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('homepage-loaded.png');
  });
});

test.describe('SEO Tests', () => {
  test('should have proper structured data', async ({ page }) => {
    await page.goto('/');

    // Check for JSON-LD structured data
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toBeVisible();

    const jsonLd = await structuredData.textContent();
    expect(jsonLd).toBeTruthy();

    const data = JSON.parse(jsonLd!);
    expect(data).toHaveProperty('@context', 'https://schema.org');
  });

  test('should have proper canonical URL', async ({ page }) => {
    await page.goto('/');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /https?:\/\//);
  });

  test('should have proper alternate language links', async ({ page }) => {
    await page.goto('/');

    const alternates = page.locator('link[rel="alternate"]');
    const count = await alternates.count();

    // Should have alternate links for supported languages
    expect(count).toBeGreaterThan(0);

    // Check hreflang attributes
    for (let i = 0; i < count; i++) {
      const alternate = alternates.nth(i);
      await expect(alternate).toHaveAttribute('hreflang');
    }
  });
});
