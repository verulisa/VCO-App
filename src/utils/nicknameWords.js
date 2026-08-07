// English-only, mixing everyday/domestic animals with a few more exotic ones —
// plus vegan-friendly farmyard picks, since this is a vegan festival.
export const ADJECTIVES = [
  "Curious", "Sleepy", "Zesty", "Muddy", "Wandering", "Cosmic", "Groovy",
  "Feral", "Gentle", "Chatty", "Sunburnt", "Barefoot", "Glowing", "Dusty",
  "Rowdy", "Mellow", "Speedy", "Cheeky", "Windswept", "Radiant",
];

export const ANIMALS = [
  "Hedgehog", "Otter", "Goat", "Duck", "Badger", "Chicken", "Fox", "Sloth",
  "Axolotl", "Alpaca", "Donkey", "Pigeon", "Squirrel", "Llama", "Pony",
  "Hamster", "Rabbit", "Owl", "Raccoon", "Ferret", "Cow", "Pig", "Turtle",
  "Peacock", "Wombat", "Cricket", "Newt", "Capybara", "Meerkat", "Vole",
];

export function generateNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj} ${animal} #${num}`;
}

// One emoji per animal — several of these (ferret, wombat, meerkat, newt,
// capybara, alpaca...) have no dedicated emoji in Unicode, so it's a
// closest-fit substitute, but each pick is kept unique so two different
// animals never render the same icon.
const ANIMAL_EMOJI = {
  Hedgehog: "🦔", Otter: "🦦", Goat: "🐐", Duck: "🦆", Badger: "🦡",
  Chicken: "🐔", Fox: "🦊", Sloth: "🦥", Axolotl: "🦎", Alpaca: "🐑",
  Donkey: "🫏", Pigeon: "🐦", Squirrel: "🐿️", Llama: "🦙", Pony: "🐴",
  Hamster: "🐹", Rabbit: "🐰", Owl: "🦉", Raccoon: "🦝", Ferret: "🦫",
  Cow: "🐮", Pig: "🐷", Turtle: "🐢", Peacock: "🦚", Wombat: "🐻",
  Cricket: "🦗", Newt: "🐸", Capybara: "🐾", Meerkat: "🐁", Vole: "🐭",
};

export function nicknameEmoji(nickname) {
  const animal = ANIMALS.find((a) => nickname.includes(a));
  return ANIMAL_EMOJI[animal] || "🌱";
}
