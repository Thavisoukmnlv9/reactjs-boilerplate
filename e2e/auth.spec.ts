import { expect, test } from '@playwright/test'

test('signs in and lands on the dashboard', async ({ page }) => {
  await page.goto('/login')
  // Credentials are pre-filled to match the MSW demo backend.
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
})

test('redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/users')
  await expect(page).toHaveURL(/\/login/)
})
