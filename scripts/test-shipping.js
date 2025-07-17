/**
 * Script de test pour les frais de livraison Colissimo
 */

import { useShipping } from '../composables/useShipping.js'

const { 
  calculateShippingCost, 
  parseWeight, 
  getShippingZone,
  formatShippingPrice,
  isFreeShippingEligible 
} = useShipping()

console.log('🚚 Test du système de frais de livraison Colissimo\n')

// Test 1: Calcul des frais de livraison pour différents poids
console.log('📦 Test 1: Calcul des frais de livraison France métropolitaine')
const testWeights = [0.25, 0.5, 1, 2, 5, 10]
testWeights.forEach(weight => {
  const standardCost = calculateShippingCost(weight, 'FR', '', 'standard')
  const accessCost = calculateShippingCost(weight, 'FR', '', 'access')
  console.log(`  ${weight}kg -> Standard: ${formatShippingPrice(standardCost)}, Access: ${formatShippingPrice(accessCost)}`)
})

// Test 2: Zones géographiques
console.log('\n🌍 Test 2: Détection des zones géographiques')
const testCountries = [
  { code: 'FR', postal: '75001', expected: 'france-metropolitaine' },
  { code: 'FR', postal: '97100', expected: 'outre-mer-om1' },
  { code: 'DE', postal: '', expected: 'europe' },
  { code: 'US', postal: '', expected: 'monde' },
  { code: 'GP', postal: '', expected: 'outre-mer-om1' }
]

testCountries.forEach(test => {
  const zone = getShippingZone(test.code, test.postal)
  const status = zone === test.expected ? '✅' : '❌'
  console.log(`  ${test.code} ${test.postal} -> ${zone} ${status}`)
})

// Test 3: Parsing des poids
console.log('\n⚖️  Test 3: Parsing des poids')
const testWeightStrings = ['250g', '1kg', '1.5 kg', '750 g', '2,5kg', 'invalid']
testWeightStrings.forEach(weightStr => {
  const parsed = parseWeight(weightStr)
  console.log(`  "${weightStr}" -> ${parsed}kg`)
})

// Test 4: Livraison gratuite
console.log('\n🆓 Test 4: Livraison gratuite')
const testAmounts = [25, 50, 75, 100]
testAmounts.forEach(amount => {
  const isFree = isFreeShippingEligible(amount, 'FR')
  const status = isFree ? '✅ Gratuite' : '❌ Payante'
  console.log(`  ${amount}€ -> ${status}`)
})

// Test 5: Tarifs par zone
console.log('\n🌐 Test 5: Tarifs par zone pour 1kg')
const zones = [
  { country: 'FR', postal: '75001', name: 'France métropolitaine' },
  { country: 'FR', postal: '97100', name: 'Outre-mer (Guadeloupe)' },
  { country: 'DE', postal: '', name: 'Allemagne (Europe)' },
  { country: 'US', postal: '', name: 'États-Unis (Monde)' }
]

zones.forEach(zone => {
  const cost = calculateShippingCost(1, zone.country, zone.postal)
  console.log(`  ${zone.name}: ${formatShippingPrice(cost)}`)
})

console.log('\n✅ Tests terminés')
