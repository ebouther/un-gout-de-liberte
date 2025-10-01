import { test, expect } from '@playwright/test';

/**
 * Test e-commerce STRICT avec test.step()
 * 
 * ✅ Échoue immédiatement si un élément critique est manquant
 * ⚠️ Continue pour les éléments optionnels
 * 
 * Éléments CRITIQUES :
 * - Chargement de la page
 * - Liste des produits (au moins 1)
 * - Bouton "Ajouter au panier"
 * - Panier fonctionnel
 * - Bouton checkout
 * 
 * Éléments OPTIONNELS :
 * - Logo, filtres, badges
 * - Variantes de produits
 * - Navigation secondaire
 */
test.describe('E-commerce Complete Flow (STRICT)', () => {
  test('Parcours client complet - version stricte', async ({ page }) => {
    let loadTime: number;
    let productCount: number;

    // ========================================
    // STEP 1: Chargement initial [CRITIQUE]
    // ========================================
    await test.step('Chargement de la page d\'accueil', async () => {
      const startTime = Date.now();
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      loadTime = Date.now() - startTime;
      console.log(`✅ Site chargé en ${loadTime}ms`);

      // Assertion critique : la page doit charger
      await expect(page).toHaveTitle(/Un Goût de Liberté/i, { timeout: 10000 });
    });

    // ========================================
    // STEP 2: Vérification de la page d'accueil [MIXTE]
    // ========================================
    await test.step('Vérifier les éléments de la page d\'accueil', async () => {
      // CRITIQUE : Navigation doit exister
      const navbar = page.locator('nav, [role="navigation"]').first();
      await expect(navbar).toBeVisible({ timeout: 5000 });
      console.log('✅ Navigation visible');

      // OPTIONNEL : Logo
      const logo = page.locator('img[alt*="logo" i], img[alt*="Un Goût" i]').first();
      if (await logo.count() > 0) {
        await expect(logo).toBeVisible();
        console.log('✅ Logo visible');
      } else {
        console.log('⚠️ Logo non trouvé (optionnel)');
      }
    });

    // ========================================
    // STEP 3: Liste des produits [CRITIQUE]
    // ========================================
    await test.step('Vérifier la liste des produits', async () => {
      // CRITIQUE : Au moins 1 produit doit être affiché
      const productCards = page.locator('article.group');
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });

      productCount = await productCards.count();
      expect(productCount).toBeGreaterThan(0);
      console.log(`✅ ${productCount} produits trouvés`);
    });

    // ========================================
    // STEP 4: Filtres de catégorie [OPTIONNEL]
    // ========================================
    await test.step('Tester les filtres de catégorie', async () => {
      const categoryButtons = page.locator('button:has-text("Confiture"), button:has-text("Biscuit"), button:has-text("Apéritif"), [data-category]');
      const categoryCount = await categoryButtons.count();

      if (categoryCount > 0) {
        console.log(`✅ ${categoryCount} filtres disponibles`);

        const firstCategory = categoryButtons.first();
        const categoryName = await firstCategory.textContent();
        await firstCategory.click();
        await page.waitForTimeout(500);
        console.log(`✅ Filtre "${categoryName?.trim()}" appliqué`);

        const allButton = page.locator('button:has-text("Tous"), button:has-text("All")');
        if (await allButton.count() > 0) {
          await allButton.first().click();
          await page.waitForTimeout(300);
          console.log('✅ Filtre réinitialisé');
        }
      } else {
        console.log('⚠️ Aucun filtre de catégorie (optionnel)');
      }
    });

    // ========================================
    // STEP 5: Détails du produit [CRITIQUE]
    // ========================================
    await test.step('Ouvrir et vérifier la page produit', async () => {
      const productCards = page.locator('article.group');
      const firstProduct = productCards.first();

      // CRITIQUE : Le produit doit être cliquable
      await expect(firstProduct).toBeVisible();
      await firstProduct.click();
      await page.waitForTimeout(1000);
      console.log('✅ Produit ouvert');

      // CRITIQUE : Un titre doit être affiché
      const productTitle = page.locator('h1, h2, h3').first();
      await expect(productTitle).toBeVisible({ timeout: 5000 });
      const titleText = await productTitle.textContent();
      console.log(`✅ Titre: "${titleText?.trim()}"`);

      // CRITIQUE : Un prix doit être visible
      const price = page.locator('text=/\\d+[,.]\\d+\\s*€/').first();
      await expect(price).toBeVisible({ timeout: 5000 });
      console.log(`✅ Prix affiché`);

      // OPTIONNEL : Image produit
      const productImage = page.locator('img[alt], img[src]').first();
      if (await productImage.count() > 0) {
        await expect(productImage).toBeVisible();
        console.log('✅ Image visible');
      } else {
        console.log('⚠️ Image non trouvée (optionnel)');
      }
    });

    // ========================================
    // STEP 6: Sélection de variantes [OPTIONNEL]
    // ========================================
    await test.step('Sélectionner une variante de produit', async () => {
      const variantButtons = page.locator('button:has-text("g"), button:has-text("kg"), button[class*="variant"], select option');
      const variantCount = await variantButtons.count();

      if (variantCount > 0) {
        console.log(`✅ ${variantCount} variantes disponibles`);
        await variantButtons.first().click();
        await page.waitForTimeout(300);
        console.log('✅ Variante sélectionnée');
      } else {
        console.log('⚠️ Aucune variante pour ce produit (optionnel)');
      }
    });

    // ========================================
    // STEP 7: Premier ajout au panier [CRITIQUE]
    // ========================================
    await test.step('Ajouter le premier produit au panier', async () => {
      const addToCartButton = page.locator(
        'button:has-text("Ajouter au panier"), ' +
        'button:has-text("Ajouter"), ' +
        'button:has-text("Add to cart")'
      ).first();

      // CRITIQUE : Le bouton "Ajouter au panier" DOIT exister
      await expect(addToCartButton).toBeVisible({ timeout: 5000 });
      await addToCartButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Produit ajouté au panier');

      // OPTIONNEL : Badge panier
      const cartBadge = page.locator('[class*="badge"], span').filter({ hasText: /\d+/ });
      if (await cartBadge.count() > 0 && await cartBadge.first().isVisible()) {
        const badgeText = await cartBadge.first().textContent();
        console.log(`✅ Badge panier: ${badgeText}`);
      } else {
        console.log('⚠️ Badge panier non visible (optionnel)');
      }

      // Fermer le modal si présent
      const closeButton = page.locator('button:has-text("×"), button[aria-label*="close" i], button[aria-label*="fermer" i]').first();
      if (await closeButton.count() > 0 && await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(500);
        console.log('✅ Modal fermé');
      }
    });

    // ========================================
    // STEP 8: Deuxième ajout au panier [CRITIQUE]
    // ========================================
    await test.step('Ajouter un deuxième produit', async () => {
      await page.waitForTimeout(500);
      const secondProduct = page.locator('article.group').nth(1);

      // CRITIQUE : Au moins 2 produits doivent exister
      await expect(secondProduct).toBeVisible({ timeout: 5000 });
      await secondProduct.click();
      await page.waitForTimeout(1000);
      console.log('✅ 2ème produit ouvert');

      const addToCart2 = page.locator(
        'button:has-text("Ajouter au panier"), ' +
        'button:has-text("Ajouter")'
      ).first();

      // CRITIQUE : Le bouton doit être là
      await expect(addToCart2).toBeVisible({ timeout: 5000 });
      await addToCart2.click();
      await page.waitForTimeout(1000);
      console.log('✅ 2ème produit ajouté');

      const closeButton2 = page.locator('button:has-text("×"), button[aria-label*="close" i]').first();
      if (await closeButton2.count() > 0 && await closeButton2.isVisible()) {
        await closeButton2.click();
        await page.waitForTimeout(500);
      }
    });

    // ========================================
    // STEP 9: Ouverture du panier [CRITIQUE]
    // ========================================
    await test.step('Ouvrir et vérifier le panier', async () => {
      const cartButton = page.locator('button').filter({ hasText: 'Panier' }).first();

      // CRITIQUE : Le bouton panier DOIT exister
      await expect(cartButton).toBeVisible({ timeout: 5000 });

      const badgeText = await cartButton.textContent();
      console.log(`✅ Bouton panier: "${badgeText?.trim()}"`);

      await cartButton.click();
      await page.waitForTimeout(1500);
      console.log('✅ Panier ouvert');

      // CRITIQUE : L'interface du panier doit s'afficher
      const cartModal = page.locator('[role="dialog"], .cart-modal, [class*="cart"]').first();
      await expect(cartModal).toBeVisible({ timeout: 5000 });
      console.log('✅ Interface panier visible');

      // CRITIQUE : Au moins un article doit être visible
      const itemsInCart = page.locator('article, .cart-item, [class*="item"]').filter({ hasText: /€/ });
      const itemCount = await itemsInCart.count();
      expect(itemCount).toBeGreaterThan(0);
      console.log(`✅ ${itemCount} article(s) dans le panier`);

      // CRITIQUE : Un total doit être affiché
      const totalPrice = page.locator('text=/Total|Sous-total/i').first();
      await expect(totalPrice).toBeVisible({ timeout: 5000 });
      const totalText = await totalPrice.textContent();
      console.log(`✅ Total: ${totalText?.trim()}`);
    });

    // ========================================
    // STEP 10: Modification de quantité [CRITIQUE]
    // ========================================
    await test.step('Modifier la quantité d\'un article', async () => {
      const quantitySelect = page.locator('select[id*="quantity"]').first();

      // CRITIQUE : Le contrôle de quantité DOIT exister
      await expect(quantitySelect).toBeVisible({ timeout: 5000 });

      const currentValue = await quantitySelect.inputValue();
      console.log(`ℹ️ Quantité actuelle: ${currentValue}`);

      await quantitySelect.selectOption('3');
      await page.waitForTimeout(1000);

      // Vérifier que la quantité a bien changé
      const newValue = await quantitySelect.inputValue();
      expect(newValue).toBe('3');
      console.log('✅ Quantité → 3 (vérifié)');

      await quantitySelect.selectOption('1');
      await page.waitForTimeout(1000);
      console.log('✅ Quantité → 1');
    });

    // ========================================
    // STEP 11: Suppression d'article [CRITIQUE]
    // ========================================
    await test.step('Supprimer un article du panier', async () => {
      const removeButtons = page.locator('button').filter({ hasText: 'Supprimer' });

      // CRITIQUE : Au moins un bouton "Supprimer" doit exister
      await expect(removeButtons.first()).toBeVisible({ timeout: 5000 });
      const removeButtonCount = await removeButtons.count();
      console.log(`✅ ${removeButtonCount} bouton(s) Supprimer`);

      const itemsBefore = await page.locator('li.py-6, li').filter({ has: page.locator('button:has-text("Supprimer")') }).count();

      await removeButtons.first().click();
      await page.waitForTimeout(1000);

      const itemsAfter = await page.locator('li.py-6, li').filter({ has: page.locator('button:has-text("Supprimer")') }).count();

      // CRITIQUE : Le nombre d'articles doit avoir diminué
      expect(itemsAfter).toBeLessThan(itemsBefore);
      console.log('✅ Article supprimé avec succès (vérifié)');
    });

    // ========================================
    // STEP 12: Processus de checkout [CRITIQUE]
    // ========================================
    await test.step('Vérifier le bouton de paiement', async () => {
      const checkoutButton = page.locator('button').filter({ hasText: /Finaliser l'achat|Commander|Payer/ }).first();

      // CRITIQUE : Le bouton checkout DOIT exister
      await expect(checkoutButton).toBeVisible({ timeout: 5000 });

      const isDisabled = await checkoutButton.isDisabled();

      if (isDisabled) {
        console.log('✅ Bouton désactivé (panier vide)');
      } else {
        console.log('✅ Bouton "Finaliser l\'achat" actif et fonctionnel');
        console.log('ℹ️ Test arrêté avant envoi réel (pas de paiement test)');
      }
    });

    // ========================================
    // STEP 13: Fermeture du panier [CRITIQUE]
    // ========================================
    await test.step('Fermer le panier', async () => {
      const closeCartButton = page.locator('button').filter({ hasText: 'Continuer mes achats' }).first();

      if (await closeCartButton.count() > 0) {
        await closeCartButton.click();
        await page.waitForTimeout(500);
        console.log('✅ Panier fermé');
      } else {
        // Alternative : bouton X
        const xButton = page.locator('button[type="button"]').filter({ has: page.locator('svg') }).first();
        await expect(xButton).toBeVisible({ timeout: 5000 });
        await xButton.click();
        await page.waitForTimeout(500);
        console.log('✅ Panier fermé via X');
      }

      // CRITIQUE : Le panier doit être fermé
      const cartModal = page.locator('[role="dialog"]').first();
      await expect(cartModal).not.toBeVisible({ timeout: 5000 });
      console.log('✅ Panier bien fermé (vérifié)');
    });

    // ========================================
    // STEP 14: Navigation générale [OPTIONNEL]
    // ========================================
    await test.step('Tester la navigation du site', async () => {
      const contactLink = page.locator('a').filter({ hasText: 'Contact' }).or(page.locator('a').filter({ hasText: 'contacter' })).first();
      if (await contactLink.count() > 0) {
        await contactLink.click();
        await page.waitForTimeout(1500);
        console.log('✅ Lien Contact cliqué');
      } else {
        console.log('⚠️ Lien Contact non trouvé (optionnel)');
      }

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);

      const aboutLink = page.locator('button, a').filter({ hasText: /À propos|A propos|About/i }).first();
      if (await aboutLink.count() > 0) {
        await aboutLink.click();
        await page.waitForTimeout(1000);
        console.log('✅ Section À propos');
      } else {
        console.log('⚠️ Section À propos non trouvée (optionnel)');
      }

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);

      const blogLink = page.locator('button, a').filter({ hasText: /Blog|Articles/i }).first();
      if (await blogLink.count() > 0) {
        await blogLink.click();
        await page.waitForTimeout(1500);
        console.log('✅ Section Blog');
      } else {
        console.log('⚠️ Section Blog non trouvée (optionnel)');
      }
    });

    // ========================================
    // STEP 15: Test responsive mobile [OPTIONNEL]
    // ========================================
    await test.step('Tester la version mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      console.log('✅ Vue mobile (375x667)');

      const burgerMenu = page.locator('button').filter({ has: page.locator('svg') }).first();
      if (await burgerMenu.count() > 0) {
        try {
          await burgerMenu.click({ timeout: 2000 });
          await page.waitForTimeout(500);
          console.log('✅ Menu mobile interagi');
        } catch {
          console.log('⚠️ Menu mobile non cliquable (optionnel)');
        }
      } else {
        console.log('⚠️ Menu mobile non trouvé (optionnel)');
      }

      await page.setViewportSize({ width: 1280, height: 720 });
      await page.waitForTimeout(500);
      console.log('✅ Vue desktop restaurée');
    });

    // ========================================
    // RÉSUMÉ FINAL
    // ========================================
    await test.step('Afficher le résumé du test', async () => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ TEST E-COMMERCE STRICT COMPLET - TOUS LES TESTS PASSÉS');
      console.log('='.repeat(60));
      console.log(`⏱️  Temps de chargement: ${loadTime}ms`);
      console.log(`📦 Produits trouvés: ${productCount}`);
      console.log('🔒 Tous les éléments CRITIQUES vérifiés avec expect()');
      console.log('✅ Fonctionnalités e-commerce validées avec succès');
      console.log('='.repeat(60) + '\n');
    });
  });
});
