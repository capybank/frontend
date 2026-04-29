// Mock data for the prototype

const MOCK_USER_CLIENT = {
  id: 'u_client',
  name: 'Maya Chen',
  initials: 'MC',
  handle: '@mayabuilds',
  level: 'Studio Owner',
  balance: 4287.42,
  walletAddress: '0x7Aa3...e91F',
  pending: 320.00,
  inEscrow: 1500.00,
};

const MOCK_USER_CREATOR = {
  id: 'u_creator',
  name: 'Jordan Park',
  initials: 'JP',
  handle: '@jordananimates',
  level: 'Top Rated · Animator',
  balance: 1862.18,
  walletAddress: '0x3F2c...b84A',
  pending: 500.00,
  inEscrow: 2750.00,
};

const CATEGORIES = [
  { id: 'all', label: 'All categories', icon: 'Sparkles' },
  { id: 'animation', label: 'Animation', icon: 'Video' },
  { id: 'scripting', label: 'Scripting', icon: 'Code' },
  { id: 'building', label: '3D Building', icon: 'Box' },
  { id: 'ui', label: 'UI Design', icon: 'Brush' },
  { id: 'modeling', label: 'Character Models', icon: 'Hand' },
  { id: 'sfx', label: 'Sound & Music', icon: 'Music' },
  { id: 'marketing', label: 'Game Promo', icon: 'Megaphone' },
];

const GIGS = [
  {
    id: 'g1', cov: 'cov-2', coverLabel: 'rig.preview.gif',
    title: 'I will animate cinematic cutscenes for your Roblox game',
    seller: { name: 'Jordan Park', initials: 'JP', level: 'Top Rated' },
    rating: 4.9, reviews: 312, price: 50, category: 'animation',
  },
  {
    id: 'g2', cov: 'cov-4', coverLabel: 'obby_ui_kit.fig',
    title: 'I will design a slick HUD and shop UI for your Roblox experience',
    seller: { name: 'Aria Volkov', initials: 'AV', level: 'Level 2' },
    rating: 5.0, reviews: 187, price: 80, category: 'ui',
  },
  {
    id: 'g3', cov: 'cov-3', coverLabel: 'pet_walk.mp4',
    title: 'I will rig and animate cute pet companions for your game',
    seller: { name: 'Devon Liu', initials: 'DL', level: 'Top Rated' },
    rating: 4.8, reviews: 412, price: 35, category: 'animation',
  },
  {
    id: 'g4', cov: 'cov-5', coverLabel: 'lobby_v2.rbxl',
    title: 'I will build a premium lobby map with custom lighting',
    seller: { name: 'Reese Okafor', initials: 'RO', level: 'Level 2' },
    rating: 4.9, reviews: 156, price: 120, category: 'building',
  },
  {
    id: 'g5', cov: 'cov-7', coverLabel: 'datastore.lua',
    title: 'I will write a robust DataStore + leaderboard system',
    seller: { name: 'Sam Whitlock', initials: 'SW', level: 'Pro' },
    rating: 5.0, reviews: 92, price: 100, category: 'scripting',
  },
  {
    id: 'g6', cov: 'cov-6', coverLabel: 'character_v3.fbx',
    title: 'I will model a stylised character with morphs ready for Roblox',
    seller: { name: 'Iris Tanaka', initials: 'IT', level: 'Top Rated' },
    rating: 4.9, reviews: 234, price: 90, category: 'modeling',
  },
  {
    id: 'g7', cov: 'cov-8', coverLabel: 'soundpack.zip',
    title: 'I will compose original lo-fi music loops for your game',
    seller: { name: 'Theo Brennan', initials: 'TB', level: 'Level 2' },
    rating: 4.7, reviews: 98, price: 45, category: 'sfx',
  },
  {
    id: 'g8', cov: 'cov-1', coverLabel: 'thumb_a.png',
    title: 'I will design click-worthy YouTube thumbnails for Roblox content',
    seller: { name: 'Nora Chen', initials: 'NC', level: 'Top Rated' },
    rating: 4.9, reviews: 521, price: 25, category: 'marketing',
  },
];

// The job at the center of the escrow flow
const ACTIVE_JOB = {
  id: 'job_8742',
  title: 'Cinematic intro cutscene for Tycoon Heroes',
  description: '10 scenes of fully animated cinematics for our launch trailer. We need camera work, character rigs synced to a provided storyboard, and final renders at 1080p. Reference style: Jailbreak / Pinewood. Roblox Studio file delivered as .rbxl.',
  category: 'Animation · Cinematics',
  scenes: 10,
  pricePerScene: 50,
  total: 500,
  duration: 14, // days
  client: { name: 'Maya Chen', initials: 'MC', studio: 'Pixelforge Studios', rating: 4.9, jobs: 24 },
  creator: { name: 'Jordan Park', initials: 'JP', level: 'Top Rated · Animator', rating: 4.9, jobs: 312, deliveryDays: 7 },
  applicants: [
    { name: 'Jordan Park', initials: 'JP', rating: 4.9, reviews: 312, deliveryDays: 7, price: 500, level: 'Top Rated', message: 'I have shipped intro cinematics for 4 front-page games. I can deliver 10 polished scenes in 7 days using your storyboard.', selected: true },
    { name: 'Devon Liu', initials: 'DL', rating: 4.8, reviews: 412, deliveryDays: 10, price: 425, level: 'Top Rated', message: 'Pet animator turned cinematics specialist. Sample reel attached.' },
    { name: 'Aria Volkov', initials: 'AV', rating: 5.0, reviews: 187, deliveryDays: 14, price: 480, level: 'Level 2', message: 'I bring strong UI motion to cinematics. Happy to do a free 1-scene test.' },
  ],
  contractAddress: '0x9d8E...4Ac1',
  txHash: '0x4a72f1...9cE3d8',
  network: 'Base · USDC',
  fundedAt: 'Apr 22, 2026 · 14:32 UTC',
};

const TRANSACTIONS = [
  { id: 't1', kind: 'in', title: 'Escrow released — Pet rigs (Pinewood)', sub: 'From: 0x4F1c...9a82 · 2h ago', amount: 350.00, txHash: '0x91…f4' },
  { id: 't2', kind: 'escrow', title: 'Escrow funded — Cinematic intro', sub: 'Smart contract · 0x9d8E...4Ac1 · Apr 22', amount: -500.00, txHash: '0x4a…d8' },
  { id: 't3', kind: 'in', title: 'P2P · Aria Volkov sent you USDC', sub: 'For: UI consult · Apr 21', amount: 120.00, txHash: '0xc1…e7' },
  { id: 't4', kind: 'out', title: 'Withdraw to bank · ANZ ••5512', sub: 'Apr 19 · Pending 2 business days', amount: -800.00, txHash: '—' },
  { id: 't5', kind: 'in', title: 'Add funds · Visa ••4221', sub: 'Apr 18 · Onramp via Stripe', amount: 1000.00, txHash: '—' },
  { id: 't6', kind: 'in', title: 'Escrow released — Lobby build', sub: 'From: 0x771c...0aE2 · Apr 14', amount: 600.00, txHash: '0xfd…21' },
  { id: 't7', kind: 'out', title: 'Sent to Reese Okafor', sub: 'Tip · Apr 11', amount: -25.00, txHash: '0x7a…b2' },
];

const ACTIVE_ESCROWS = [
  { id: 'e1', title: 'Cinematic intro · 10 scenes', counterparty: 'Jordan Park', counterpartyInitials: 'JP', amount: 500.00, status: 'in_progress', daysLeft: 5, percent: 60, contract: '0x9d8E...4Ac1' },
  { id: 'e2', title: 'HUD redesign · 4 screens', counterparty: 'Aria Volkov', counterpartyInitials: 'AV', amount: 320.00, status: 'funded', daysLeft: 13, percent: 5, contract: '0x2Bf1...87aA' },
  { id: 'e3', title: 'Character model · Yeti', counterparty: 'Iris Tanaka', counterpartyInitials: 'IT', amount: 180.00, status: 'review', daysLeft: 1, percent: 95, contract: '0x71F0...5512' },
];

window.AppData = { MOCK_USER_CLIENT, MOCK_USER_CREATOR, CATEGORIES, GIGS, ACTIVE_JOB, TRANSACTIONS, ACTIVE_ESCROWS };
