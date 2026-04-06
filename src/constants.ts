export interface Question {
  q: string;
  correct: string[];
  wrong: string[];
}

export interface Fact {
  text: string;
  true: boolean;
}

export interface EmojiPuzzle {
  emojis: string[];
  answer: string;
}

export const CURIOSITY_DB: Question[] = [
  { q: "Qual è l'animale che dorme di più al giorno?", correct: ["Koala", "Bradipo"], wrong: ["Gatto", "Leone", "Pipistrello", "Tartaruga"] },
  { q: "Quale paese ha più isole al mondo?", correct: ["Svezia", "Finlandia"], wrong: ["Indonesia", "Filippine", "Giappone", "Grecia"] },
  { q: "Qual è il metallo più abbondante nella crosta terrestre?", correct: ["Alluminio", "Ferro"], wrong: ["Rame", "Oro", "Argento", "Titanio"] },
  { q: "Quale organo umano consuma più energia?", correct: ["Cervello", "Fegato"], wrong: ["Cuore", "Polmoni", "Stomaco", "Reni"] },
  { q: "Qual è l'oceano più profondo?", correct: ["Pacifico", "Atlantico"], wrong: ["Indiano", "Artico", "Antartico", "Mediterraneo"] },
  { q: "Quale animale ha il morso più potente?", correct: ["Coccodrillo", "Ippopotamo"], wrong: ["Squalo", "Leone", "Orso", "Lupo"] },
  { q: "Quale pianeta ha più lune?", correct: ["Saturno", "Giove"], wrong: ["Marte", "Urano", "Nettuno", "Terra"] },
  { q: "Quale frutto contiene più vitamina C?", correct: ["Guava", "Kiwi"], wrong: ["Arancia", "Limone", "Fragola", "Mango"] },
  { q: "Quale è il fiume più lungo del mondo?", correct: ["Nilo", "Amazzoni"], wrong: ["Mississippi", "Yangtze", "Danubio", "Gange"] },
  { q: "Quale animale può vivere più a lungo?", correct: ["Tartaruga", "Balena"], wrong: ["Elefante", "Pappagallo", "Aquila", "Corvo"] },
  { q: "Quale paese produce più caffè al mondo?", correct: ["Brasile", "Vietnam"], wrong: ["Colombia", "Etiopia", "Italia", "Kenya"] },
  { q: "Qual è l'elemento chimico più leggero?", correct: ["Idrogeno", "Elio"], wrong: ["Litio", "Carbonio", "Ossigeno", "Azoto"] },
  { q: "Quale animale ha il cuore più grande?", correct: ["Balenottera azzurra", "Elefante"], wrong: ["Giraffa", "Cavallo", "Gorilla", "Ippopotamo"] },
  { q: "Quale città è la più popolosa al mondo?", correct: ["Tokyo", "Delhi"], wrong: ["New York", "Londra", "Pechino", "San Paolo"] },
  { q: "Quale animale è il più veloce in volo?", correct: ["Falco pellegrino", "Rondone"], wrong: ["Aquila", "Colibrì", "Albatros", "Gufo"] },
  { q: "Quale paese ha la forma di uno stivale?", correct: ["Italia", "Nuova Zelanda"], wrong: ["Portogallo", "Cile", "Giappone", "Norvegia"] },
  { q: "Quale osso è il più piccolo del corpo umano?", correct: ["Staffa", "Incudine"], wrong: ["Rotula", "Coccige", "Femore", "Falange"] },
  { q: "Quale sport è il più praticato al mondo?", correct: ["Calcio", "Nuoto"], wrong: ["Tennis", "Basket", "Cricket", "Golf"] },
  { q: "Quale materiale naturale è il più duro?", correct: ["Diamante", "Corindone"], wrong: ["Quarzo", "Rubino", "Granito", "Topazio"] },
  { q: "Quale gas compone la maggior parte dell'atmosfera?", correct: ["Azoto", "Ossigeno"], wrong: ["Anidride carbonica", "Argon", "Elio", "Metano"] },
];

export const MEMORY_WORDS_POOL = [
  "farfalla", "vulcano", "oceano", "foresta", "deserto", "ghiacciaio", "aurora", "tempesta", "corallo", "monsone",
  "galassia", "asteroide", "cometa", "nebulosa", "supernova", "satellite", "eclissi", "meteora", "pulsar", "quasar",
  "ornitorinco", "camaleonte", "fenicottero", "medusa", "pangolino", "axolotl", "narval", "quetzal", "okapi", "dugongo",
  "molecola", "neutrino", "fotosintesi", "magnetismo", "entropia", "isotopo", "catalisi", "osmosi", "fusione", "fissione",
  "origami", "mosaico", "calligrafia", "affresco", "terracotta", "ceramica", "papiro", "geroglifico", "mandala", "runa",
  "zafferano", "pistacchio", "melograno", "bergamotto", "cardamomo", "vaniglia", "cannella", "wasabi", "tartufo", "quinoa",
  "arcipelago", "penisola", "altopiano", "istmo", "fiordo", "tundra", "savana", "steppa", "delta", "oasi"
];

export const SPRINT_FACTS: Fact[] = [
  { text: "I polpi hanno 3 cuori", true: true },
  { text: "La Luna ha un'atmosfera", true: false },
  { text: "Le api possono contare fino a 4", true: true },
  { text: "L'oro è magnetico", true: false },
  { text: "I delfini dormono con un occhio aperto", true: true },
  { text: "I ragni hanno 6 zampe", true: false },
  { text: "Il miele non scade mai", true: true },
  { text: "Il vetro è un liquido", true: false },
  { text: "Le mucche hanno migliori amici", true: true },
  { text: "L'acqua calda gela più in fretta", true: true },
  { text: "I pesci non possono tossire", true: false },
  { text: "Le banane sono radioattive", true: true },
  { text: "La muraglia cinese si vede dallo spazio", true: false },
  { text: "I gatti hanno più ossa degli umani", true: true },
  { text: "Giove è una stella mancata", true: true },
  { text: "I diamanti sono indistruttibili", true: false },
  { text: "Le formiche non dormono mai", true: false },
  { text: "Il sangue dei granchi è blu", true: true },
  { text: "Il sole è una palla di fuoco", true: false },
  { text: "Le piante comunicano tra loro", true: true },
  { text: "L'Everest è il punto più lontano dal centro della Terra", true: false },
  { text: "I koala hanno impronte digitali", true: true },
  { text: "Cleopatra era egiziana", true: false },
  { text: "Le stelle marine non hanno cervello", true: true },
  { text: "I fenicotteri nascono rosa", true: false },
  { text: "Lo squalo è più vecchio degli alberi", true: true },
  { text: "La pioggia ha un odore perché è sporca", true: false },
  { text: "I corvi ricordano i volti umani", true: true },
  { text: "Venere ruota al contrario", true: true },
  { text: "I pinguini volano sott'acqua", true: true },
  { text: "Il deserto del Sahara è sempre stato arido", true: false },
  { text: "Le anguille elettriche sono pesci", true: false },
  { text: "L'universo ha un suono", true: true },
  { text: "Il cervello non sente dolore", true: true },
  { text: "I cammelli immagazzinano acqua nelle gobbe", true: false },
  { text: "Le ostriche cambiano sesso", true: true },
  { text: "Plutone è più piccolo della Luna", true: true },
  { text: "I serpenti sentono con la lingua", true: true },
  { text: "L'acciaio è più pesante del piombo", true: false },
  { text: "Le tartarughe respirano dal sedere", true: true },
  { text: "I vulcani esistono solo sulla Terra", true: false },
  { text: "Le lucciole sono fredde quando brillano", true: true },
  { text: "Il cuore umano batte circa 100.000 volte al giorno", true: true },
  { text: "I camaleonti cambiano colore per mimetizzarsi", true: false },
  { text: "I funghi sono più vicini agli animali che alle piante", true: true },
  { text: "La luce del sole impiega 8 secondi per arrivare", true: false },
  { text: "Le zebre sono bianche con strisce nere", true: false },
  { text: "L'acqua copre circa il 71% della Terra", true: true },
  { text: "I cani vedono in bianco e nero", true: false },
  { text: "Le farfalle assaggiano con i piedi", true: true },
  { text: "Il titanio è più leggero dell'alluminio", true: false },
  { text: "Le stelle cadenti sono stelle vere", true: false },
  { text: "Il bambù può crescere quasi un metro al giorno", true: true },
  { text: "I gatti sempre atterrano sulle zampe", true: false },
  { text: "La carta moneta è fatta di carta", true: false },
];

export const EMOJI_PUZZLES: EmojiPuzzle[] = [
  { emojis: ['🍎', '❤️', '🎓', '📚', '💼'], answer: 'scuola' },
  { emojis: ['👑', '🦁', '🌍', '🔥', '💪'], answer: 'potenza' },
  { emojis: ['☀️', '🌈', '🌻', '🌞', '✨'], answer: 'bellezza' },
  { emojis: ['🧠', '💡', '📖', '🎯', '🚀'], answer: 'genio' },
  { emojis: ['🌊', '🏖️', '🏄', '⛱️', '🌴'], answer: 'spiaggia' },
  { emojis: ['🎬', '🍿', '🎭', '🎪', '🎨'], answer: 'spettacolo' },
  { emojis: ['🍕', '🍝', '🇮🇹', '🍷', '👨‍🍳'], answer: 'italia' },
  { emojis: ['❄️', '⛄', '🎿', '🧊', '🌨️'], answer: 'inverno' },
  { emojis: ['🎵', '🎸', '🎹', '🎤', '🎧'], answer: 'musica' },
  { emojis: ['🚗', '⚡', '🏁', '💨', '🏎️'], answer: 'velocita' },
];
