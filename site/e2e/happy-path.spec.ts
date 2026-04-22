import { test, expect } from '@playwright/test';

test('landing page renders with all 5 §sections', async ({ page }) => {
  await page.goto('/contribute/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Contribute');
  // §1 Tiers, §2 SOPs, §3 Schema, §4 Priority taxa, §5 Authorship
  const sectionCount = await page.locator('section').count();
  expect(sectionCount).toBeGreaterThanOrEqual(5);
});

test('SOPs index lists 25 protocols', async ({ page }) => {
  await page.goto('/contribute/sops/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Standard operating procedures');
  const cards = page.locator('a[href*="/contribute/sops/"]');
  // at least 25 links (each card is an anchor + header links may also match)
  expect(await cards.count()).toBeGreaterThanOrEqual(25);
});

test('wizard step 1 Welcome displays co-authorship message', async ({ page }) => {
  await page.goto('/contribute/submit/welcome/');
  await expect(page.getByText('Every contributor is named as a co-author')).toBeVisible();
  await expect(page.getByRole('link', { name: /Continue/ })).toBeVisible();
});

test('wizard taxon picker shows 8 kingdom cards', async ({ page }) => {
  await page.goto('/contribute/submit/taxon/');
  // kingdom cards are buttons with data-kingdom attribute
  const cards = page.locator('button[data-kingdom]');
  await expect(cards).toHaveCount(8);
});

test('tier picker renders 3 options', async ({ page }) => {
  await page.goto('/contribute/submit/tier/');
  const cards = page.locator('button[data-tier]');
  await expect(cards).toHaveCount(2); // T1, T2 as buttons; T3 is an <a>
  await expect(page.getByText('Raw spectra')).toBeVisible();
});
