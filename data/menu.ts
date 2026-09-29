export type MenuItem = { name: string; description: string; price: number; dietary?: "Vegetarian" | "Vegan" | "Gluten-free" };
export type MenuSection = { id: string; title: string; note: string; items: MenuItem[] };
export const menu: MenuSection[] = [
  { id: "small-plates", title: "Small Plates", note: "An opening conversation", items: [
    { name: "Warm sourdough", description: "Cultured butter, smoked sea salt", price: 12, dietary: "Vegetarian" },
    { name: "Heirloom tomatoes", description: "Charred citrus, basil, aged vinegar", price: 19, dietary: "Vegan" },
    { name: "Oyster mushrooms", description: "Fire-roasted, fermented cream, herb oil", price: 24, dietary: "Vegetarian" },
    { name: "Raw sea bream", description: "Green mandarin, cucumber, fennel pollen", price: 26, dietary: "Gluten-free" },
    { name: "Coal-kissed prawns", description: "Brown butter, preserved lemon", price: 28, dietary: "Gluten-free" },
  ]},
  { id: "mains", title: "Mains", note: "From field and water", items: [
    { name: "Roasted pumpkin", description: "Barley, burnt onion, sage", price: 34, dietary: "Vegetarian" },
    { name: "Market fish", description: "White beans, smoked tomato, parsley", price: 46, dietary: "Gluten-free" },
    { name: "Hand-cut pappardelle", description: "Wild mushrooms, aged cheese, thyme", price: 38, dietary: "Vegetarian" },
    { name: "Confit duck leg", description: "Grilled stone fruit, bitter leaves", price: 48, dietary: "Gluten-free" },
    { name: "Wood-fired cauliflower", description: "Almond cream, capers, golden raisins", price: 36, dietary: "Vegan" },
  ]},
  { id: "from-the-grill", title: "From the Grill", note: "The language of fire", items: [
    { name: "Whole sea bream", description: "Brown butter, grilled lemon, fennel", price: 58, dietary: "Gluten-free" },
    { name: "Dry-aged ribeye", description: "250 g, marrow jus, watercress", price: 82, dietary: "Gluten-free" },
    { name: "Charred leek", description: "Hazelnut, miso, soft herbs", price: 29, dietary: "Vegetarian" },
    { name: "Lamb rump", description: "Rosemary embers, smoked aubergine", price: 62, dietary: "Gluten-free" },
    { name: "Grilled seasonal greens", description: "Lemon, garlic, olive oil", price: 18, dietary: "Vegan" },
  ]},
  { id: "desserts", title: "Desserts", note: "A slower finish", items: [
    { name: "Burnt honey custard", description: "Poached pear, oat crumble", price: 19, dietary: "Vegetarian" },
    { name: "Dark chocolate crémeux", description: "Malt, olive oil, sea salt", price: 21, dietary: "Vegetarian" },
    { name: "Grilled pineapple", description: "Coconut sorbet, lime", price: 18, dietary: "Vegan" },
    { name: "Cheese selection", description: "Three cheeses, fruit preserve, crackers", price: 26, dietary: "Vegetarian" },
    { name: "House sorbet", description: "Ask for the evening’s flavour", price: 14, dietary: "Vegan" },
  ]},
  { id: "drinks", title: "Drinks", note: "For the table", items: [
    { name: "Ember Martini", description: "Gin, vermouth, olive leaf", price: 24 },
    { name: "Golden Hour", description: "Whisky, citrus, smoked honey", price: 25 },
    { name: "Garden Fizz", description: "Cucumber, basil, sparkling tea · alcohol-free", price: 16 },
    { name: "House red / white", description: "Curated glass selection", price: 19 },
    { name: "Still / sparkling water", description: "For the table", price: 8 },
  ]},
];
