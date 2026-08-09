/**
 * Donatellos 2 menu.
 *
 * PRICING RULES — read before editing:
 *  - The printed in-store menu is the only source of truth. Nothing here comes
 *    from Slice, DoorDash or any other ordering platform.
 *  - Standard item prices already include the owner's +$1.00 adjustment over the
 *    printed price. They are stored as final display values. Never recompute.
 *  - Modifiers, add-ons and the lunch special were NOT adjusted and must stay
 *    exactly as printed.
 *  - `price: null` means the price is genuinely unknown. Do not fill one in.
 *
 * Item shape:
 *   { id, name, description?, price?, prices?: [{ label, price }], priceNote?, verify? }
 */

export const menu = [
  {
    id: 'fresh-hot-pizzas',
    name: 'Fresh Hot Pizzas',
    blurb: 'Dough made in-house. Sauce made in-house.',
    items: [
      {
        id: 'plain-cheese-pizza',
        name: 'Plain Cheese Pizza',
        prices: [
          { label: 'Medium', price: 12.99 },
          { label: 'Large', price: 14.99 },
        ],
      },
      { id: 'sicilian-pizza', name: 'Sicilian Pizza', price: 19.99 },
      { id: 'pizza-by-the-slice', name: 'Pizza by the Slice', price: 4.99 },
      {
        id: 'grandmas-pan-pizza',
        name: "Grandma's Pan Pizza",
        description: '10-inch personal pizza.',
        price: 7.0,
        // Owner confirmed this is a 10-inch personal pizza. The printed menu
        // showed $6.00; $7.00 applies the owner's +$1.00 rule.
      },
      {
        id: 'cauliflower-gluten-free-pizza',
        name: 'Cauliflower / Gluten Free Pizza',
        price: 11.99,
        // Read from the in-store menu, which prints $10.99; $11.99 applies the
        // owner's +$1.00 rule. The owner confirmed this listing.
      },
    ],
    modifiers: {
      title: 'Toppings',
      note: 'Topping prices are as printed on the in-store menu. A specialty pizza on cauliflower crust is $3.00 less than the regular specialty price.',
      items: [
        { id: 'topping-medium', name: 'Medium topping, each', price: 2.5 },
        { id: 'topping-large', name: 'Large topping, each', price: 3.0 },
        { id: 'topping-sicilian', name: 'Sicilian topping, each', price: 4.0 },
        { id: 'half-topping-medium', name: 'Half topping, medium', price: 2.0 },
        { id: 'half-topping-large', name: 'Half topping, large', price: 2.5 },
        { id: 'half-topping-sicilian', name: 'Half topping, Sicilian', price: 3.0 },
        { id: 'topping-cauliflower', name: 'Cauliflower crust topping, each', price: 2.0 },
      ],
    },
    // Transcribed from the "Topping Choices" panel on the in-store menu.
    choices: {
      title: 'Topping choices',
      items: [
        'Pepperoni',
        'Italian sausage',
        'Extra cheese',
        'Onions',
        'Pineapple',
        'Ham',
        'Bacon',
        'Black olives',
        'Anchovies',
        'Hamburger',
        'Tomato',
        'Green peppers',
        'Mushrooms',
        'Broccoli',
      ],
    },
  },

  {
    id: 'specialty-gourmet-pizzas',
    name: 'Specialty & Gourmet Pizzas',
    // Sicilian Pizza appears on the printed specialty list at the same $19.99 as
    // the base pizza above. Listed once, under Fresh Hot Pizzas.
    items: [
      { id: 'old-world-pizza', name: 'Old World Pizza', price: 16.99 },
      { id: 'white-pizza', name: 'White Pizza', price: 17.99 },
      { id: 'pickle-pizza', name: 'Pickle Pizza', price: 17.99 },
      { id: 'bbq-chicken-pizza', name: 'BBQ Chicken Pizza', price: 20.99 },
      { id: 'buffalo-chicken-ranch-pizza', name: 'Buffalo Chicken Ranch Pizza', price: 20.99 },
      { id: 'mac-daddy-pizza', name: 'Mac Daddy Pizza', price: 20.99 },
      { id: 'deluxe-pizza', name: 'Deluxe Pizza', price: 20.99 },
      { id: 'meat-lovers-pizza', name: 'Meat Lovers Pizza', price: 20.99 },
      { id: 'veggie-lovers-pizza', name: 'Veggie Lovers Pizza', price: 20.99 },
      { id: 'house-pizza', name: 'House Pizza', price: 20.99 },
      { id: 'chicken-pesto-pizza', name: 'Chicken Pesto Pizza', price: 21.99 },
      { id: 'bacon-chicken-ranch-pizza', name: 'Bacon Chicken Ranch Pizza', price: 20.99 },
      { id: 'taco-pizza', name: 'Taco Pizza', price: 20.99 },
      { id: 'hawaiian-pizza', name: 'Hawaiian Pizza', price: 17.99 },
      { id: 'napoletana-pizza', name: 'Napoletana Pizza', price: 21.99 },
      { id: 'large-pita', name: 'Large Pita', price: 22.99 },
    ],
  },

  {
    id: 'fresh-mozzarella-pizzas',
    name: 'Fresh Mozzarella Pizzas',
    items: [
      { id: 'margherita-pizza', name: 'Margherita Pizza', price: 17.99 },
      { id: 'americano-pizza', name: 'Americano Pizza', price: 20.99 },
      { id: 'alfredo-pizza', name: 'Alfredo Pizza', price: 22.99 },
      { id: 'the-final-offer-pizza', name: 'The Final Offer Pizza', price: 21.99 },
    ],
  },

  {
    id: 'stuffed-pizzas',
    name: 'Stuffed Pizzas',
    items: [
      { id: 'stuffed-italian-meat-lovers', name: 'Stuffed Italian Meat Lovers Pizza', price: 27.99 },
      { id: 'stuffed-chicken-bacon-ranch', name: 'Stuffed Chicken Bacon Ranch Pizza', price: 27.99 },
      { id: 'stuffed-cheesesteak-onion', name: 'Stuffed Cheesesteak & Onion Pizza', price: 27.99 },
      { id: 'southwest-burger-pizza', name: 'Southwest Burger Pizza', price: 27.99 },
      { id: 'stuffed-buffalo-chicken', name: 'Stuffed Buffalo Chicken Pizza', price: 27.99 },
    ],
  },

  {
    id: 'stromboli',
    name: 'Stromboli',
    blurb: 'Bread dough made in-house.',
    priceColumns: ['Medium', 'Large'],
    items: [
      {
        id: 'original-boli',
        name: 'Original Boli',
        prices: [
          { label: 'Medium', price: 14.99 },
          { label: 'Large', price: 19.99 },
        ],
      },
      {
        id: 'meat-lover-boli',
        name: 'Meat Lover Boli',
        prices: [
          { label: 'Medium', price: 14.99 },
          { label: 'Large', price: 19.99 },
        ],
      },
      {
        id: 'donatellos-special-boli',
        name: "Donatello's Special Boli",
        prices: [
          { label: 'Medium', price: 14.99 },
          { label: 'Large', price: 19.99 },
        ],
      },
      {
        id: 'ham-boli',
        name: 'Ham Boli',
        prices: [
          { label: 'Medium', price: 14.99 },
          { label: 'Large', price: 19.99 },
        ],
      },
      {
        id: 'cheesesteak-and-onions-boli',
        name: 'Cheesesteak and Onions Boli',
        prices: [
          { label: 'Medium', price: 14.99 },
          { label: 'Large', price: 19.99 },
        ],
      },
      {
        id: 'ham-calzone',
        name: 'Ham Calzone',
        prices: [
          { label: 'Medium', price: 14.99 },
          { label: 'Large', price: 19.99 },
        ],
      },
    ],
  },

  {
    id: 'wings',
    name: 'Wings',
    note: 'Boneless or bone-in. Served with ranch or bleu cheese and your choice of sauce.',
    items: [
      { id: 'wings-6', name: '6 Wings', price: 11.99 },
      { id: 'wings-12', name: '12 Wings', price: 15.99 },
      { id: 'wings-18', name: '18 Wings', price: 21.99 },
      { id: 'wings-24', name: '24 Wings', price: 25.99 },
      { id: 'wings-50', name: '50 Wings', price: 44.99 },
    ],
    modifiers: {
      title: 'Add',
      items: [{ id: 'extra-dressing-sauce', name: 'Extra dressing or sauce', price: 0.5 }],
    },
    // Transcribed from the "Choose Your Sauce" panel on the in-store menu, which
    // separates entries with dashes. The owner confirmed that
    // "Mild Salt & Pepper" is one sauce.
    choices: {
      title: 'Choose your sauce',
      items: [
        'Honey BBQ',
        'Garlic Parmesan',
        'Hot BBQ',
        'Sriracha',
        'Mild Salt & Pepper',
        'Teriyaki',
        'Sweet & Sour',
        'Spicy BBQ',
        'Mango Habanero',
        'Old Bay',
      ],
    },
  },

  {
    id: 'hot-subs',
    name: 'Hot Subs',
    items: [
      { id: 'cheeseburger-sub', name: 'Cheeseburger Sub', price: 10.5 },
      { id: 'pizza-burger-sub', name: 'Pizza Burger Sub', price: 10.5 },
      { id: 'bacon-cheeseburger-sub', name: 'Bacon Cheeseburger', price: 10.99 },
      { id: 'cheesesteak-sub', name: 'Cheesesteak Sub', price: 10.5 },
      { id: 'chicken-cheesesteak-sub', name: 'Chicken Cheesesteak Sub', price: 10.5 },
      { id: 'pizza-steak-sub', name: 'Pizza Steak Sub', price: 10.5 },
      { id: 'meatball-sub', name: 'Meatball Sub', price: 10.75 },
      { id: 'california-cheesesteak-sub', name: 'California Cheesesteak Sub', price: 10.5 },
      {
        id: 'chicken-california-cheesesteak-sub',
        name: 'Chicken California Cheesesteak Sub',
        price: 10.5,
      },
      { id: 'chicken-parmigiana-sub', name: 'Chicken Parmigiana Sub', price: 11.75 },
      { id: 'mikeys-special-cheesesteak-sub', name: "Mikey's Special Cheesesteak Sub", price: 12.0 },
      { id: 'mac-daddy-cheeseburger-sub', name: 'Mac Daddy Cheeseburger Sub', price: 11.99 },
      {
        id: 'sophis-surf-n-turf-cheesesteak-sub',
        name: "Sophi's Surf-N-Turf Cheesesteak Sub",
        price: 12.99,
      },
      { id: 'meatball-parmesan-sub', name: 'Meatball Parmesan Sub', price: 11.75 },
      { id: 'eggplant-parmesan-sub', name: 'Eggplant Parmesan Sub', price: 11.75 },
      { id: 'veal-parmesan-sub', name: 'Veal Parmesan Sub', price: 11.75 },
      { id: 'sebastians-special-sub', name: "Sebastian's Special Sub", price: 12.0 },
    ],
  },

  {
    id: 'cold-subs',
    name: 'Cold Subs',
    items: [
      { id: 'italian-sub', name: 'Italian Sub', price: 10.75 },
      { id: 'ham-cheese-sub', name: 'Ham & Cheese Sub', price: 10.5 },
      { id: 'turkey-cheese-sub', name: 'Turkey & Cheese Sub', price: 10.5 },
      { id: 'ham-or-turkey-sub', name: 'Ham or Turkey Sub', price: 10.5 },
      { id: 'tuna-sub', name: 'Tuna', price: 10.5 },
      { id: 'veggie-sub', name: 'Veggie', price: 10.5 },
      { id: 'veggie-cheese-sub', name: 'Veggie & Cheese Sub', price: 10.5 },
      { id: 'double-italian-sub', name: 'Double Italian Sub', price: 13.25 },
    ],
  },

  {
    id: 'wraps',
    name: 'Wraps',
    // The printed menu lists Buffalo Chicken Wrap twice. Shown once.
    items: [
      { id: 'chicken-caesar-wrap', name: 'Chicken Caesar Wrap', price: 8.49 },
      { id: 'chicken-fajita-wrap', name: 'Chicken Fajita Wrap', price: 8.49 },
      { id: 'club-wrap', name: 'Club Wrap', price: 8.49 },
      { id: 'cheesesteak-wrap', name: 'Cheesesteak Wrap', price: 8.49 },
      { id: 'buffalo-chicken-wrap', name: 'Buffalo Chicken Wrap', price: 8.49 },
      { id: 'italian-wrap', name: 'Italian Wrap', price: 8.49 },
    ],
  },

  {
    id: 'sandwiches-burgers',
    name: 'Sandwiches & Burgers',
    items: [
      { id: 'deluxe-cheeseburger', name: 'Deluxe Cheeseburger', price: 8.75 },
      { id: 'bacon-cheeseburger', name: 'Bacon Cheeseburger', price: 8.75 },
      { id: 'fish-sandwich', name: 'Fish Sandwich', price: 8.75 },
      { id: 'crispy-chicken-sandwich', name: 'Crispy Chicken Sandwich', price: 8.75 },
      { id: 'pizza-burger', name: 'Pizza Burger', price: 8.75 },
      { id: 'double-cheeseburger', name: 'Double Cheeseburger', price: 10.75 },
      { id: 'grilled-chicken-sandwich', name: 'Grilled Chicken Sandwich', price: 8.75 },
      { id: 'portobello-mushroom-sandwich', name: 'Portobello Mushroom Sandwich', price: 8.75 },
    ],
  },

  {
    id: 'appetizers-sides',
    name: 'Appetizers & Sides',
    items: [
      { id: 'french-fries', name: 'French Fries', price: 5.75 },
      { id: 'mozzarella-sticks', name: 'Mozzarella Sticks', price: 7.75 },
      { id: 'fried-pickles', name: 'Fried Pickles', price: 8.99 },
      { id: 'breaded-mushrooms', name: 'Breaded Mushrooms', price: 7.49 },
      { id: 'chicken-fingers', name: 'Chicken Fingers (5)', price: 9.5 },
      { id: 'onion-rings', name: 'Onion Rings', price: 7.25 },
      { id: 'bread-sticks', name: 'Bread Sticks (8)', price: 9.99 },
      { id: 'meatballs-in-marinara', name: 'Meatballs in Marinara (5)', price: 7.45 },
      { id: 'beer-battered-shrimp', name: 'Beer Battered Shrimp', price: 9.49 },
      { id: 'stuffed-tater-tots', name: 'Stuffed Tater Tots (6)', price: 8.49 },
      { id: 'crabby-fries', name: 'Crabby Fries', price: 10.99 },
      { id: 'jalapeno-poppers', name: 'Jalapeño Poppers (6)', price: 8.49 },
      { id: 'garlic-knots', name: 'Garlic Knots (8)', price: 7.99 },
      { id: 'garlic-bread', name: 'Garlic Bread', price: 4.0 },
      { id: 'buffalo-chicken-french-fries', name: 'Buffalo Chicken French Fries', price: 12.99 },
      { id: 'sophis-surf-n-turf-fries', name: "Sophi's Surf N Turf Fries", price: 12.99 },
      { id: 'raphaels-crabby-fries', name: "Raphael's Crabby Fries", price: 11.99 },
      { id: 'sebastians-sausage-peppers', name: "Sebastian's Sausage & Peppers", price: 8.5 },
      { id: 'fresh-fried-calamari', name: 'Fresh Fried Calamari', price: 10.99 },
    ],
  },

  {
    id: 'salads',
    name: 'Fresh Romaine Salads',
    items: [
      { id: 'tossed-salad', name: 'Tossed Salad', price: 10.05 },
      { id: 'caesar-salad', name: 'Caesar Salad', price: 8.49 },
      { id: 'chef-cito-salad', name: 'Chef-Cito Salad', price: 11.49 },
      { id: 'shrimp-avocado-salad', name: 'Shrimp Avocado Salad', price: 14.5 },
      { id: 'steak-salad', name: 'Steak Salad', price: 11.49 },
      { id: 'grilled-chicken-salad', name: 'Grilled Chicken Salad', price: 11.49 },
      { id: 'sophis-special-surf-turf-salad', name: "Sophi's Special Surf & Turf Salad", price: 14.5 },
      { id: 'house-salad', name: 'House Salad', price: 11.49 },
      { id: 'chicken-caesar-salad', name: 'Chicken Caesar Salad', price: 11.49 },
    ],
  },

  {
    id: 'pasta-dinners',
    name: 'Homemade Pasta Dinners',
    note: 'All pasta dinners are served with a small tossed salad.',
    items: [
      { id: 'spaghetti', name: 'Spaghetti', price: 13.99 },
      { id: 'lasagna', name: 'Lasagna', price: 13.99 },
      { id: 'fettuccini-alfredo', name: 'Fettuccini Alfredo', price: 13.99 },
      { id: 'linguini-clam-sauce', name: 'Linguini w/ Clam Sauce', price: 17.99 },
      { id: 'eggplant-parmigiana', name: 'Eggplant Parmigiana', price: 15.99 },
      { id: 'veal-parmigiana', name: 'Veal Parmigiana', price: 15.99 },
      { id: 'meatball-parmigiana', name: 'Meatball Parmigiana', price: 15.99 },
      { id: 'shrimp-white-wine-sauce', name: 'Shrimp in White Wine Sauce', price: 17.99 },
      { id: 'spaghetti-chicken-parmigiana', name: 'Spaghetti w/ Chicken Parmigiana', price: 15.99 },
      { id: 'baked-ziti', name: 'Baked Ziti', price: 13.99 },
      { id: 'penne-pesto', name: 'Penne Pesto', price: 13.99 },
      { id: 'raviolini-homemade-marinara', name: 'Raviolini Homemade Marinara', price: 11.99 },
    ],
  },

  {
    id: 'desserts',
    name: 'Desserts',
    items: [
      { id: 'funnel-fries', name: 'Funnel Fries', price: 6.99 },
      { id: 'lemon-drop', name: 'Lemon Drop', price: 6.99 },
      { id: 'cannoli', name: 'Cannoli', price: 6.99 },
      { id: 'tiramisu', name: 'Tiramisu', price: 6.99 },
      { id: 'peanut-butter-bomb', name: 'Peanut Butter Bomb', price: 6.99 },
      {
        id: 'specialty-dessert',
        name: 'Specialty Dessert',
        // No printed price. Shown as an ask-us item rather than guessing.
        price: null,
        priceNote: 'Ask us',
      },
    ],
  },

  {
    id: 'beverages',
    name: 'Beverages',
    // TODO: beverage prices were not on the supplied printed menu. Add them from
    // the in-store menu only. Names render without prices until then.
    items: [
      { id: 'soda', name: 'Soda', price: null },
      { id: 'water', name: 'Water', price: null },
      { id: 'two-liter', name: '2 Liter', price: null },
    ],
  },

  {
    id: 'lunch-specials',
    name: 'Lunch Specials',
    items: [
      {
        id: 'two-slices-and-drink',
        name: 'Two Pizza Slices & Drink',
        // Printed special price. The +$1.00 rule does not apply here.
        price: 7.99,
      },
    ],
  },
]

/** Categories linked from the homepage "On the Menu" section. */
export const featuredCategoryIds = [
  'fresh-hot-pizzas',
  'specialty-gourmet-pizzas',
  'wings',
  'hot-subs',
  'stromboli',
  'pasta-dinners',
  'appetizers-sides',
  'salads',
]

export function formatPrice(price) {
  if (price == null) return null
  return `$${price.toFixed(2)}`
}

/**
 * Case-insensitive search across item name, description and category name.
 * Returns the same category shape so the menu renders identically when filtered.
 */
export function filterMenu(query) {
  const q = query.trim().toLowerCase()
  if (!q) return menu

  return menu
    .map((category) => {
      const categoryMatches = category.name.toLowerCase().includes(q)
      const items = category.items.filter(
        (item) =>
          categoryMatches ||
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)),
      )
      const modifierItems = category.modifiers?.items.filter(
        (item) => categoryMatches || item.name.toLowerCase().includes(q),
      )

      if (!items.length && !modifierItems?.length) return null

      return {
        ...category,
        items,
        modifiers:
          category.modifiers && modifierItems?.length
            ? { ...category.modifiers, items: modifierItems }
            : null,
      }
    })
    .filter(Boolean)
}

export function countItems(categories) {
  return categories.reduce(
    (total, category) => total + category.items.length + (category.modifiers?.items.length ?? 0),
    0,
  )
}
