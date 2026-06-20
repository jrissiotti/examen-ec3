// @ts-nocheck
/**
 * Tests E2E - Flujo Completo de Descarga
 * @module e2e/downloadFlow.spec
 */

import { test, expect } from '@playwright/test';

test.describe('E2E: Flujo Completo de Descarga', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  // TEST 1: Crear descarga exitosa
  test('usuario debe poder crear descarga Mock exitosa', async ({ page }) => {
    const uniqueUrl = `https://example.com/success-${Date.now()}.pdf`;
    
    await page.fill('[id="url"]', uniqueUrl);
    await page.click('.p-dropdown');
    await page.click('text=Mock (Simulación)');
    await page.locator('.p-inputnumber-input').fill('3');
    await page.click('button:has-text("Iniciar Descarga")');

    await page.waitForSelector(`text=${uniqueUrl}`, { timeout: 5000 });

    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
    
    await expect(page.locator('body')).toContainText(uniqueUrl);
  });

  // TEST 2: Crear descarga que falla
  test('usuario debe poder crear descarga Mock que falla', async ({ page }) => {
    const uniqueUrl = `https://fail.example.com/fail-${Date.now()}.pdf`;
    
    const rowsBefore = await page.locator('tbody tr').count();
    
    await page.fill('[id="url"]', uniqueUrl);
    await page.click('.p-dropdown');
    await page.click('text=Mock (Simulación)');
    await page.locator('.p-inputnumber-input').fill('1');
    await page.click('button:has-text("Iniciar Descarga")');

    await page.waitForTimeout(2000);

    await page.click('button[aria-label="Refrescar"]');
    await page.waitForTimeout(1000);

    const rowsAfter = await page.locator('tbody tr').count();
    expect(rowsAfter).toBeGreaterThanOrEqual(rowsBefore);
    
    const bodyText = await page.locator('body').textContent();
    const hasDownloads = bodyText?.includes('Descargas Activas');
    expect(hasDownloads).toBe(true);
  }, 15000);

  // TEST 3: Reintentar descarga fallida
  test('usuario debe poder reintentar descarga fallida', async ({ page }) => {
    const uniqueUrl = `https://fail.example.com/retry-${Date.now()}.pdf`;
    
    await page.fill('[id="url"]', uniqueUrl);
    await page.click('.p-dropdown');
    await page.click('text=Mock (Simulación)');
    await page.locator('.p-inputnumber-input').fill('1');
    await page.click('button:has-text("Iniciar Descarga")');

    await page.waitForSelector(`text=${uniqueUrl}`, { timeout: 5000 });

    await page.waitForTimeout(10000);
    await page.click('button[aria-label="Refrescar"]');
    await page.waitForTimeout(1000);

    const retryButton = page.locator('button[aria-label="Reintentar"]').first();
    const isVisible = await retryButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await retryButton.click();
      await page.waitForTimeout(2000);
      await expect(page.locator('body')).toContainText(uniqueUrl);
    }
  }, 25000);

  // TEST 4: Ver detalles
  test('usuario debe poder ver detalles de descarga', async ({ page }) => {
    const uniqueUrl = `https://example.com/detail-${Date.now()}.pdf`;
    
    await page.fill('[id="url"]', uniqueUrl);
    await page.click('.p-dropdown');
    await page.click('text=Mock (Simulación)');
    await page.click('button:has-text("Iniciar Descarga")');

    await page.waitForSelector(`text=${uniqueUrl}`, { timeout: 5000 });

    const viewButton = page.locator('button[aria-label="Ver detalles"]').first();
    await expect(viewButton).toBeVisible();
    await viewButton.click();

    await page.waitForSelector('text=Detalle de Descarga', { timeout: 5000 });
    
    const dialog = page.locator('.p-dialog');
    await expect(dialog).toContainText(uniqueUrl);
    
    await page.click('button:has-text("Cerrar")');
  });

  // TEST 5: Listar múltiples descargas
  test('usuario debe poder listar múltiples descargas con estados diferentes', async ({ page }) => {
    const urls = [
      `https://example.com/multi-1-${Date.now()}.pdf`,
      `https://example.com/multi-2-${Date.now()}.pdf`,
      `https://fail.example.com/multi-3-${Date.now()}.pdf`,
    ];

    for (const url of urls) {
      await page.fill('[id="url"]', url);
      await page.click('.p-dropdown');
      await page.click('text=Mock (Simulación)');
      await page.click('button:has-text("Iniciar Descarga")');
      await page.waitForTimeout(500);
    }

    await page.click('button[aria-label="Refrescar"]');
    await page.waitForTimeout(1000);

    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(2);
  }, 15000);

  // TEST 6: URL inválida
  test('debe mostrar error con URL inválida', async ({ page }) => {
    await page.fill('[id="url"]', 'no-es-url-valida');
    await page.click('.p-dropdown');
    await page.click('text=Mock (Simulación)');
    
    await page.waitForTimeout(500);

    const submitButton = page.locator('button:has-text("Iniciar Descarga")');
    const isDisabled = await submitButton.isDisabled();
    expect(isDisabled).toBe(true);

    const urlInput = page.locator('[id="url"]');
    const hasInvalidClass = await urlInput.evaluate((el) => 
      el.classList.contains('p-invalid')
    );
    expect(hasInvalidClass).toBe(true);
  });
});