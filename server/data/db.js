const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'agency.db');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS team (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatarInitials TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 6
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    clientName TEXT NOT NULL,
    owner TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Planning',
    deadline TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    tags TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    campaignId TEXT NOT NULL,
    title TEXT NOT NULL,
    assignee TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium',
    status TEXT NOT NULL DEFAULT 'Todo',
    description TEXT DEFAULT '',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (campaignId) REFERENCES campaigns(id) ON DELETE CASCADE
  );
`);

// Seed only if empty
const teamCount = db.prepare('SELECT COUNT(*) as c FROM team').get().c;
if (teamCount === 0) {
  const insertTeam = db.prepare(
    'INSERT INTO team (id, name, role, avatarInitials, capacity) VALUES (?, ?, ?, ?, ?)'
  );
  const team = [
    ['tm-1', 'Maya Chen',    'Creative Director', 'MC', 5],
    ['tm-2', 'Liam Torres',  'Copywriter',        'LT', 6],
    ['tm-3', 'Priya Nair',   'Strategist',        'PN', 4],
    ['tm-4', 'Jordan Blake', 'Designer',          'JB', 4],
    ['tm-5', 'Sam Okafor',   'Analyst',           'SO', 7],
  ];
  team.forEach(t => insertTeam.run(...t));

  const insertCampaign = db.prepare(
    `INSERT INTO campaigns (id, title, clientName, owner, status, deadline, progress, tags, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const campaigns = [
    ['c-1','Spring Launch',      'NovaBrew Coffee',  'Maya Chen',    'In Progress','2026-06-15', 65, '["Social Media","Email"]',          '2026-01-15T09:00:00Z'],
    ['c-2','Summer Rebrand',     'Zephyr Fitness',   'Jordan Blake', 'Planning',   '2026-07-30', 20, '["Brand","Design"]',                '2026-02-01T09:00:00Z'],
    ['c-3','Product Hunt Push',  'Arclight SaaS',    'Priya Nair',   'Review',     '2026-05-20', 90, '["PR","Social Media"]',             '2026-03-01T09:00:00Z'],
    ['c-4','Loyalty Program',    'NovaBrew Coffee',  'Liam Torres',  'Delivered',  '2026-04-01',100, '["Email","CRM"]',                   '2025-12-10T09:00:00Z'],
    ['c-5','Q3 Awareness',       'Meridian Health',  'Sam Okafor',   'In Progress','2026-08-31', 40, '["Content","SEO"]',                 '2026-03-15T09:00:00Z'],
    ['c-6','Holiday Campaign',   'Solstice Apparel', 'Maya Chen',    'Planning',   '2026-11-01', 10, '["Social Media","Influencer"]',     '2026-04-01T09:00:00Z'],
  ];
  campaigns.forEach(c => insertCampaign.run(...c));

  const insertTask = db.prepare(
    `INSERT INTO tasks (id, campaignId, title, assignee, dueDate, priority, status, description, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const tasks = [
    // c-1 NovaBrew Spring Launch
    ['t-1', 'c-1','Write Instagram copy series',   'Liam Torres',  '2026-05-28','High',    'In Progress','Create 12-post Instagram series for spring launch.','2026-01-16T10:00:00Z'],
    ['t-2', 'c-1','Design social media assets',    'Jordan Blake', '2026-05-25','High',    'Review',    'Visual assets for spring launch across all platforms.','2026-01-16T10:30:00Z'],
    ['t-3', 'c-1','Email newsletter template',     'Maya Chen',    '2026-06-01','Medium',  'In Progress','Design and code responsive email template for launch.','2026-01-17T09:00:00Z'],
    ['t-4', 'c-1','Competitor analysis report',    'Sam Okafor',   '2026-05-10','Low',     'Done',      'Analyze top 5 competitor spring campaigns.','2026-01-17T09:30:00Z'],
    ['t-5', 'c-1','Campaign strategy brief',       'Priya Nair',   '2026-04-30','Critical','Done',      'Define audience segments and channel strategy.','2026-01-18T10:00:00Z'],
    // c-2 Zephyr Fitness
    ['t-6', 'c-2','Brand discovery workshop',      'Priya Nair',   '2026-06-15','High',    'Todo',      'Facilitate brand discovery session with Zephyr team.','2026-02-02T10:00:00Z'],
    ['t-7', 'c-2','Logo concepts v1',              'Jordan Blake', '2026-06-30','Medium',  'Todo',      'Deliver 3 initial logo directions for review.','2026-02-02T10:30:00Z'],
    ['t-8', 'c-2','Brand voice guidelines',        'Liam Torres',  '2026-07-05','Medium',  'Todo',      'Write tone-of-voice doc and sample copy.','2026-02-03T09:00:00Z'],
    ['t-9', 'c-2','Market research deck',          'Sam Okafor',   '2026-06-10','Low',     'In Progress','Fitness industry landscape & competitor analysis.','2026-02-03T09:30:00Z'],
    ['t-10','c-2','Rebrand timeline & roadmap',    'Maya Chen',    '2026-06-01','High',    'Todo',      'Create master project plan with milestones.','2026-02-04T10:00:00Z'],
    // c-3 Arclight SaaS
    ['t-11','c-3','Product Hunt listing copy',     'Liam Torres',  '2026-05-15','Critical','Review',   'Tagline, description, and first comment copy.','2026-03-02T10:00:00Z'],
    ['t-12','c-3','Product screenshots & GIFs',    'Jordan Blake', '2026-05-12','High',    'Done',      'Polished screenshots and feature GIFs for listing.','2026-03-02T10:30:00Z'],
    ['t-13','c-3','Community outreach plan',       'Priya Nair',   '2026-05-14','High',    'Review',   'Identify & reach out to relevant PH communities.','2026-03-03T09:00:00Z'],
    ['t-14','c-3','Launch-day metrics tracker',    'Sam Okafor',   '2026-05-18','Medium',  'In Progress','Set up live dashboard for upvotes, signups, traffic.','2026-03-03T09:30:00Z'],
    ['t-15','c-3','Press kit design',              'Maya Chen',    '2026-05-10','Medium',  'Done',      'Media kit with logos, screenshots, founder bios.','2026-03-04T10:00:00Z'],
    // c-4 NovaBrew Loyalty (all Done)
    ['t-16','c-4','Email sequence (6 emails)',     'Liam Torres',  '2026-03-20','High',    'Done',      'Welcome + nurture sequence for loyalty members.','2025-12-11T10:00:00Z'],
    ['t-17','c-4','Loyalty badge design',          'Jordan Blake', '2026-03-15','Medium',  'Done',      'Tiered badge icons (Bronze, Silver, Gold).','2025-12-11T10:30:00Z'],
    ['t-18','c-4','Program strategy document',     'Priya Nair',   '2026-03-01','High',    'Done',      'Points system, rewards, and program mechanics.','2025-12-12T09:00:00Z'],
    ['t-19','c-4','Analytics dashboard setup',     'Sam Okafor',   '2026-03-25','Medium',  'Done',      'Track enrollments, redemptions, and CLV impact.','2025-12-12T09:30:00Z'],
    ['t-20','c-4','Customer journey map',          'Maya Chen',    '2026-02-28','Low',     'Done',      'Map touchpoints from signup to first redemption.','2025-12-13T10:00:00Z'],
    // c-5 Meridian Health
    ['t-21','c-5','SEO keyword research',          'Sam Okafor',   '2026-07-15','High',    'In Progress','Identify top-50 keywords for health awareness topics.','2026-03-16T10:00:00Z'],
    ['t-22','c-5','Blog content calendar',         'Liam Torres',  '2026-07-01','Medium',  'In Progress','12-week editorial calendar with topics and owners.','2026-03-16T10:30:00Z'],
    ['t-23','c-5','Health infographic series',     'Jordan Blake', '2026-07-20','Medium',  'Todo',      '5-part infographic series on preventive health.','2026-03-17T09:00:00Z'],
    ['t-24','c-5','Paid media strategy',           'Priya Nair',   '2026-07-10','High',    'Todo',      'Channel mix, budget allocation, and targeting plan.','2026-03-17T09:30:00Z'],
    ['t-25','c-5','Content audit report',          'Sam Okafor',   '2026-06-20','Low',     'Done',      'Audit existing Meridian content for gaps and wins.','2026-03-18T10:00:00Z'],
    // c-6 Solstice Apparel
    ['t-26','c-6','Holiday mood board',            'Jordan Blake', '2026-09-01','Medium',  'Todo',      'Visual direction: color palette, textures, references.','2026-04-02T10:00:00Z'],
    ['t-27','c-6','Influencer shortlist',          'Priya Nair',   '2026-08-15','High',    'Todo',      'Identify 20 micro-influencers aligned with brand.','2026-04-02T10:30:00Z'],
    ['t-28','c-6','Holiday gift guide copy',       'Liam Torres',  '2026-09-15','Medium',  'Todo',      'Write copy for digital gift guide (8 product pages).','2026-04-03T09:00:00Z'],
    ['t-29','c-6','Campaign creative brief',       'Maya Chen',    '2026-08-01','Critical','In Progress','Master brief covering theme, channels, and KPIs.','2026-04-03T09:30:00Z'],
    ['t-30','c-6','Q4 budget planning',            'Sam Okafor',   '2026-08-10','High',    'Todo',      'Allocate holiday budget across paid, owned, earned.','2026-04-04T10:00:00Z'],
  ];
  tasks.forEach(t => insertTask.run(...t));

  console.log('✅ Database seeded with campaigns, tasks, and team members.');
}

module.exports = db;
