/**
 * Independent re-transcription of the prices in the project brief, diffed
 * against src/data/menu.js. Catches typos that a second read-through misses.
 * Run with: node scripts/audit-menu.mjs
 *
 * A photograph of the in-store menu was later checked against this list and
 * agreed with it throughout: every printed price plus the owner's $1.00
 * adjustment matches. Entries marked FROM PRINTED MENU appear on the in-store
 * menu but were not on the owner's list.
 */
import { menu } from '../src/data/menu.js'

const EXPECTED = {
  'Plain Cheese Pizza': 'Medium 12.99 | Large 14.99',
  'Sicilian Pizza': 19.99,
  'Pizza by the Slice': 4.99,
  "Grandma's Pan Pizza": 7.0,
  'Medium topping, each': 2.5,
  'Large topping, each': 3.0,
  'Sicilian topping, each': 4.0,
  'Half topping, medium': 2.0,
  'Half topping, large': 2.5,
  'Half topping, Sicilian': 3.0,
  // FROM PRINTED MENU: printed $10.99 plus the $1.00 adjustment.
  'Cauliflower / Gluten Free Pizza': 11.99,
  // FROM PRINTED MENU: a modifier, so printed price is unchanged.
  'Cauliflower crust topping, each': 2.0,

  'Old World Pizza': 16.99,
  'White Pizza': 17.99,
  'Pickle Pizza': 17.99,
  'BBQ Chicken Pizza': 20.99,
  'Buffalo Chicken Ranch Pizza': 20.99,
  'Mac Daddy Pizza': 20.99,
  'Deluxe Pizza': 20.99,
  'Meat Lovers Pizza': 20.99,
  'Veggie Lovers Pizza': 20.99,
  'House Pizza': 20.99,
  'Chicken Pesto Pizza': 21.99,
  'Bacon Chicken Ranch Pizza': 20.99,
  'Taco Pizza': 20.99,
  'Hawaiian Pizza': 17.99,
  'Napoletana Pizza': 21.99,
  'Large Pita': 22.99,

  'Margherita Pizza': 17.99,
  'Americano Pizza': 20.99,
  'Alfredo Pizza': 22.99,
  'The Final Offer Pizza': 21.99,

  'Stuffed Italian Meat Lovers Pizza': 27.99,
  'Stuffed Chicken Bacon Ranch Pizza': 27.99,
  'Stuffed Cheesesteak & Onion Pizza': 27.99,
  'Southwest Burger Pizza': 27.99,
  'Stuffed Buffalo Chicken Pizza': 27.99,

  'Original Boli': 'Medium 14.99 | Large 19.99',
  'Meat Lover Boli': 'Medium 14.99 | Large 19.99',
  "Donatello's Special Boli": 'Medium 14.99 | Large 19.99',
  'Ham Boli': 'Medium 14.99 | Large 19.99',
  'Cheesesteak and Onions Boli': 'Medium 14.99 | Large 19.99',
  'Ham Calzone': 'Medium 14.99 | Large 19.99',

  '6 Wings': 11.99,
  '12 Wings': 15.99,
  '18 Wings': 21.99,
  '24 Wings': 25.99,
  '50 Wings': 44.99,
  'Extra dressing or sauce': 0.5,

  'Cheeseburger Sub': 10.5,
  'Pizza Burger Sub': 10.5,
  // 'Bacon Cheeseburger' is on the brief twice at different prices (hot sub
  // $10.99, burger $8.75). Both are checked by category further down.
  'Cheesesteak Sub': 10.5,
  'Chicken Cheesesteak Sub': 10.5,
  'Pizza Steak Sub': 10.5,
  'Meatball Sub': 10.75,
  'California Cheesesteak Sub': 10.5,
  'Chicken California Cheesesteak Sub': 10.5,
  'Chicken Parmigiana Sub': 11.75,
  "Mikey's Special Cheesesteak Sub": 12.0,
  'Mac Daddy Cheeseburger Sub': 11.99,
  "Sophi's Surf-N-Turf Cheesesteak Sub": 12.99,
  'Meatball Parmesan Sub': 11.75,
  'Eggplant Parmesan Sub': 11.75,
  'Veal Parmesan Sub': 11.75,
  "Sebastian's Special Sub": 12.0,

  'Italian Sub': 10.75,
  'Ham & Cheese Sub': 10.5,
  'Turkey & Cheese Sub': 10.5,
  'Ham or Turkey Sub': 10.5,
  Tuna: 10.5,
  Veggie: 10.5,
  'Veggie & Cheese Sub': 10.5,
  'Double Italian Sub': 13.25,

  'Chicken Caesar Wrap': 8.49,
  'Chicken Fajita Wrap': 8.49,
  'Club Wrap': 8.49,
  'Cheesesteak Wrap': 8.49,
  'Buffalo Chicken Wrap': 8.49,
  'Italian Wrap': 8.49,

  'Deluxe Cheeseburger': 8.75,
  'Fish Sandwich': 8.75,
  'Crispy Chicken Sandwich': 8.75,
  'Pizza Burger': 8.75,
  'Double Cheeseburger': 10.75,
  'Grilled Chicken Sandwich': 8.75,
  'Portobello Mushroom Sandwich': 8.75,

  'French Fries': 5.75,
  'Mozzarella Sticks': 7.75,
  'Fried Pickles': 8.99,
  'Breaded Mushrooms': 7.49,
  'Chicken Fingers (5)': 9.5,
  'Onion Rings': 7.25,
  'Bread Sticks (8)': 9.99,
  'Meatballs in Marinara (5)': 7.45,
  'Beer Battered Shrimp': 9.49,
  'Stuffed Tater Tots (6)': 8.49,
  'Crabby Fries': 10.99,
  'Jalapeño Poppers (6)': 8.49,
  'Garlic Knots (8)': 7.99,
  'Garlic Bread': 4.0,
  'Buffalo Chicken French Fries': 12.99,
  "Sophi's Surf N Turf Fries": 12.99,
  "Raphael's Crabby Fries": 11.99,
  "Sebastian's Sausage & Peppers": 8.5,
  'Fresh Fried Calamari': 10.99,

  'Tossed Salad': 10.05,
  'Caesar Salad': 8.49,
  'Chef-Cito Salad': 11.49,
  'Shrimp Avocado Salad': 14.5,
  'Steak Salad': 11.49,
  'Grilled Chicken Salad': 11.49,
  "Sophi's Special Surf & Turf Salad": 14.5,
  'House Salad': 11.49,
  'Chicken Caesar Salad': 11.49,

  Spaghetti: 13.99,
  Lasagna: 13.99,
  'Fettuccini Alfredo': 13.99,
  'Linguini w/ Clam Sauce': 17.99,
  'Eggplant Parmigiana': 15.99,
  'Veal Parmigiana': 15.99,
  'Meatball Parmigiana': 15.99,
  'Shrimp in White Wine Sauce': 17.99,
  'Spaghetti w/ Chicken Parmigiana': 15.99,
  'Baked Ziti': 13.99,
  'Penne Pesto': 13.99,
  'Raviolini Homemade Marinara': 11.99,

  'Funnel Fries': 6.99,
  'Lemon Drop': 6.99,
  Cannoli: 6.99,
  Tiramisu: 6.99,
  'Peanut Butter Bomb': 6.99,
  'Specialty Dessert': null,

  Soda: null,
  Water: null,
  '2 Liter': null,

  'Two Pizza Slices & Drink': 7.99,
}

const problems = []
const seenIds = new Set()
const actual = new Map()

for (const category of menu) {
  const all = [...category.items, ...(category.modifiers?.items ?? [])]
  for (const item of all) {
    if (seenIds.has(item.id)) problems.push(`duplicate id: ${item.id}`)
    seenIds.add(item.id)

    const value = item.prices
      ? item.prices.map((p) => `${p.label} ${p.price.toFixed(2)}`).join(' | ')
      : item.price ?? null

    if (item.name === 'Bacon Cheeseburger') continue
    if (actual.has(item.name)) problems.push(`duplicate item name: ${item.name}`)
    actual.set(item.name, value)
  }
}

for (const [name, expected] of Object.entries(EXPECTED)) {
  if (!actual.has(name)) {
    problems.push(`MISSING from menu data: ${name}`)
    continue
  }
  const value = actual.get(name)
  const same =
    typeof expected === 'string'
      ? value === expected
      : expected === null
        ? value === null
        : Math.abs(Number(value) - expected) < 0.0001
  if (!same) problems.push(`PRICE MISMATCH ${name}: data=${value} brief=${expected}`)
}

// The two same-named, differently-priced Bacon Cheeseburger entries.
const byCategory = (categoryId, itemId) =>
  menu.find((c) => c.id === categoryId)?.items.find((i) => i.id === itemId)

const baconSub = byCategory('hot-subs', 'bacon-cheeseburger-sub')
if (baconSub?.price !== 10.99) {
  problems.push(`Hot Subs → Bacon Cheeseburger should be 10.99, got ${baconSub?.price}`)
}
const baconBurger = byCategory('sandwiches-burgers', 'bacon-cheeseburger')
if (baconBurger?.price !== 8.75) {
  problems.push(`Sandwiches & Burgers → Bacon Cheeseburger should be 8.75, got ${baconBurger?.price}`)
}

const verifyTagged = menu.flatMap((category) =>
  category.items
    .filter((item) => item.verify)
    .map((item) => ({ categoryId: category.id, item })),
)

for (const { item } of verifyTagged) {
  problems.push(`UNRESOLVED verify-tagged menu item: ${item.name}`)
}

const grandmasPan = byCategory('fresh-hot-pizzas', 'grandmas-pan-pizza')
if (grandmasPan?.description !== '10-inch personal pizza.') {
  problems.push(`Grandma's Pan Pizza must identify the owner-confirmed 10-inch personal size`)
}

for (const [name] of actual) {
  if (!(name in EXPECTED)) problems.push(`EXTRA item not in brief: ${name}`)
}

const totalItems = menu.reduce((n, c) => n + c.items.length, 0)
console.log(`categories: ${menu.length}, items: ${totalItems}, unique names checked: ${actual.size}`)

if (problems.length) {
  console.log('\nPROBLEMS:')
  for (const problem of problems) console.log(' - ' + problem)
  process.exitCode = 1
} else {
  console.log('Every price matches the brief. No duplicates, no extras, nothing missing.')
}

console.log('\nREMAINING LAUNCH CONTENT:')
console.log(' - Beverage prices: soda, water and 2 liter remain intentionally unpriced.')
console.log(
  ' - Printed add-ons: transcribe any appetizer, salad and pasta add-ons that were not supplied in the build brief.',
)
