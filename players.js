// ─── PLAYER PROFILES — 2026 WORLD CUP ────────────────────────────────────────
// Rich data for key players. Format: keyed by "TEAMCODE_Lastname"
// All stats verified as of June 2026 squad announcement.

var PLAYERS = {

  // ── ENGLAND ──────────────────────────────────────────────────────────────────
  'ENG_Kane': {
    full: 'Harry Kane', age: 32, pos: 'Striker', club: 'Bayern Munich', foot: 'Right',
    caps: 112, intlGoals: 78, wcGoals: 8, wcApps: 3,
    height: '188cm', number: 9,
    stats: { goals: 78, assists: 18, wcGoals: 8, clubGoals25_26: 36 },
    facts: [
      'England\'s all-time top scorer — 78 goals',
      'Won 2018 World Cup Golden Boot with 6 goals',
      'Missed crucial penalty vs France in Qatar 2026 QF',
      'Scored 36 Bundesliga goals in 2025-26 season',
      'Captaining England at a 3rd WC — equals Billy Wright\'s record',
      'Won Bundesliga title with Bayern in 2024-25'
    ],
    quote: '"I want to win the World Cup. That\'s my ultimate ambition."'
  },
  'ENG_Bellingham': {
    full: 'Jude Bellingham', age: 22, pos: 'Midfielder', club: 'Real Madrid', foot: 'Right',
    caps: 48, intlGoals: 14, wcGoals: 2, wcApps: 2,
    height: '186cm', number: 10,
    stats: { goals: 14, assists: 12, wcGoals: 2, clubGoals25_26: 22 },
    facts: [
      'Youngest England player to appear at a World Cup (2022)',
      'Second World Cup at just 22 years old',
      'Won La Liga and Champions League at Real Madrid',
      'England\'s biggest creative force in midfield',
      'Won 2023 Golden Boy and Kopa awards'
    ],
    quote: '"The belief in this squad is huge. We can go all the way."'
  },
  'ENG_Saka': {
    full: 'Bukayo Saka', age: 24, pos: 'Winger', club: 'Arsenal', foot: 'Left',
    caps: 52, intlGoals: 18, wcGoals: 4, wcApps: 2,
    height: '178cm', number: 7,
    stats: { goals: 18, assists: 24, wcGoals: 4, clubGoals25_26: 18 },
    facts: [
      'Missed crucial penalty in Euro 2020 final shootout',
      'Scored at both Qatar 2022 and Euro 2024',
      'Arsenal\'s Player of the Season multiple times',
      'One of the most consistent wingers in world football',
      'Key figure in England\'s transition play'
    ],
    quote: null
  },
  'ENG_Rice': {
    full: 'Declan Rice', age: 26, pos: 'Midfielder', club: 'Arsenal', foot: 'Right',
    caps: 62, intlGoals: 6, wcGoals: 0, wcApps: 2,
    height: '185cm', number: 4,
    stats: { goals: 6, assists: 10, wcGoals: 0, clubGoals25_26: 8 },
    facts: [
      'Arsenal\'s £105m record signing — world\'s most expensive midfielder (2023)',
      'Won FA Cup and Community Shield with Arsenal',
      'England\'s defensive linchpin since 2021',
      'Qualified for England after playing for Republic of Ireland U21s',
      'Leads England\'s press and recovers more balls than any midfielder'
    ],
    quote: null
  },

  // ── ARGENTINA ─────────────────────────────────────────────────────────────────
  'ARG_Messi': {
    full: 'Lionel Messi', age: 38, pos: 'Forward', club: 'Inter Miami', foot: 'Left',
    caps: 188, intlGoals: 113, wcGoals: 13, wcApps: 6,
    height: '170cm', number: 10,
    stats: { goals: 113, assists: 58, wcGoals: 13, clubGoals25_26: 12 },
    facts: [
      'Record 6th World Cup — joint record with Cristiano Ronaldo',
      '3 goals from equalling Klose\'s all-time WC record of 16',
      'Won Qatar 2022: 7 goals, Golden Ball, Golden Boot runner-up',
      '8× Ballon d\'Or winner — most in history',
      'Scored 8 goals in 2026 WC qualifying — top scorer',
      'Argentina\'s all-time top scorer with 113 goals'
    ],
    quote: '"This is probably my last World Cup. I want to savour every moment."'
  },
  'ARG_Alvarez': {
    full: 'Julián Álvarez', age: 24, pos: 'Forward', club: 'Atlético Madrid', foot: 'Right',
    caps: 42, intlGoals: 22, wcGoals: 4, wcApps: 2,
    height: '170cm', number: 9,
    stats: { goals: 22, assists: 10, wcGoals: 4, clubGoals25_26: 24 },
    facts: [
      'Scored 4 goals at Qatar 2022 including 2 in the semi-final',
      'Won Champions League with Man City before joining Atlético',
      'Known as "The Spider" for his pressing and work rate',
      'Scored 24 goals in 2025-26 La Liga season',
      'Crucial foil to Messi — creates space with his movement'
    ],
    quote: null
  },

  // ── BRAZIL ────────────────────────────────────────────────────────────────────
  'BRA_Vinicius': {
    full: 'Vinicius Jr', age: 25, pos: 'Winger', club: 'Real Madrid', foot: 'Left',
    caps: 52, intlGoals: 9, wcGoals: 0, wcApps: 1,
    height: '176cm', number: 7,
    stats: { goals: 9, assists: 18, wcGoals: 0, clubGoals25_26: 22 },
    facts: [
      'Named 2025 Ballon d\'Or winner — Brazil\'s first since Ronaldinho (2005)',
      'Scored Champions League final winner vs Liverpool (2022)',
      'Only 1 World Cup so far — this is his chance to shine',
      '22 goals for Real Madrid in 2025-26 season',
      'One of the fastest players in world football'
    ],
    quote: '"Brazil haven\'t won in 24 years. This is our time."'
  },
  'BRA_Raphinha': {
    full: 'Raphinha', age: 28, pos: 'Winger', club: 'Barcelona', foot: 'Left',
    caps: 48, intlGoals: 18, wcGoals: 2, wcApps: 2,
    height: '176cm', number: 11,
    stats: { goals: 18, assists: 16, wcGoals: 2, clubGoals25_26: 20 },
    facts: [
      'Barcelona\'s top scorer in 2024-25 La Liga title-winning season',
      'Led Brazil in Qatar when squad was ravaged by injuries',
      'Ex-Leeds United fan favourite before Barcelona move',
      'Scored 20 goals in 2025-26 with Barca'
    ],
    quote: null
  },

  // ── FRANCE ────────────────────────────────────────────────────────────────────
  'FRA_Mbappe': {
    full: 'Kylian Mbappé', age: 27, pos: 'Forward', club: 'Real Madrid', foot: 'Right',
    caps: 96, intlGoals: 56, wcGoals: 12, wcApps: 3,
    height: '178cm', number: 10,
    stats: { goals: 56, assists: 28, wcGoals: 12, clubGoals25_26: 42 },
    facts: [
      '12 World Cup goals already — level with Pelé, 4 short of Klose\'s record',
      'Scored hat-trick in 2022 WC final — first since Geoff Hurst (1966)',
      'Won 2018 WC aged 19 — youngest French scorer since 1958',
      '42 goals for Real Madrid in 2025-26 — best season of his career',
      'Could break Klose\'s all-time WC record this summer'
    ],
    quote: '"Records are there to be broken. I\'m focused on winning the trophy."'
  },
  'FRA_Griezmann': {
    full: 'Antoine Griezmann', age: 35, pos: 'Forward', club: 'Atlético Madrid', foot: 'Left',
    caps: 138, intlGoals: 48, wcGoals: 9, wcApps: 4,
    height: '176cm', number: 7,
    stats: { goals: 48, assists: 36, wcGoals: 9, clubGoals25_26: 14 },
    facts: [
      'France\'s second most-capped player ever',
      'Won 2018 World Cup and Euro 2016 runner-up',
      'Won 2018 WC Golden Ball for player of tournament',
      'Has played every tournament with France since 2014',
      'Legendary partnership with Mbappé for France'
    ],
    quote: null
  },

  // ── GERMANY ───────────────────────────────────────────────────────────────────
  'GER_Musiala': {
    full: 'Jamal Musiala', age: 22, pos: 'Midfielder', club: 'Bayern Munich', foot: 'Right',
    caps: 38, intlGoals: 12, wcGoals: 1, wcApps: 2,
    height: '180cm', number: 10,
    stats: { goals: 12, assists: 16, wcGoals: 1, clubGoals25_26: 20 },
    facts: [
      'Born in Stuttgart, raised in England — chose Germany over England',
      'Youngest Bayern scorer in Bundesliga history when he debuted',
      'Euro 2024 standout on home soil — Germany reached QF',
      'Already in his second World Cup at 22',
      'Considered Germany\'s most exciting talent in a generation'
    ],
    quote: null
  },
  'GER_Wirtz': {
    full: 'Florian Wirtz', age: 22, pos: 'Midfielder', club: 'Bayer Leverkusen', foot: 'Right',
    caps: 28, intlGoals: 8, wcGoals: 0, wcApps: 1,
    height: '180cm', number: 8,
    stats: { goals: 8, assists: 18, wcGoals: 0, clubGoals25_26: 16 },
    facts: [
      'Key figure in Leverkusen\'s unbeaten Bundesliga title in 2023-24',
      'Suffered serious ACL injury in 2022 but returned stronger',
      'Forms devastating double act with Musiala for Germany',
      'Youngest Bundesliga player to score 20+ goals in a season'
    ],
    quote: null
  },

  // ── SPAIN ─────────────────────────────────────────────────────────────────────
  'ESP_Yamal': {
    full: 'Lamine Yamal', age: 18, pos: 'Winger', club: 'Barcelona', foot: 'Right',
    caps: 22, intlGoals: 8, wcGoals: 0, wcApps: 1,
    height: '180cm', number: 11,
    stats: { goals: 8, assists: 14, wcGoals: 0, clubGoals25_26: 18 },
    facts: [
      'Born the day before Spain\'s 2006 World Cup quarter-final',
      'Scored stunning semi-final goal at Euro 2024 aged just 16',
      'Youngest ever player to play for Spain',
      'This is his first World Cup — aged just 18',
      'Considered the most exciting young player in world football',
      'La Liga Player of the Year 2024-25 aged 17'
    ],
    quote: '"I just enjoy playing. The rest takes care of itself."'
  },
  'ESP_Rodri': {
    full: 'Rodri', age: 29, pos: 'Midfielder', club: 'Man City', foot: 'Right',
    caps: 52, intlGoals: 6, wcGoals: 0, wcApps: 2,
    height: '191cm', number: 16,
    stats: { goals: 6, assists: 12, wcGoals: 0, clubGoals25_26: 4 },
    facts: [
      'Won 2024 Ballon d\'Or — best player in world that year',
      'Won Euro 2024 with Spain',
      'Won Premier League, Champions League and FA Cup with City',
      'Missed entire 2024-25 season with ACL injury',
      'The engine of both Spain and Man City — irreplaceable'
    ],
    quote: null
  },

  // ── PORTUGAL ─────────────────────────────────────────────────────────────────
  'POR_Ronaldo': {
    full: 'Cristiano Ronaldo', age: 41, pos: 'Striker', club: 'Al Nassr', foot: 'Right',
    caps: 214, intlGoals: 135, wcGoals: 8, wcApps: 6,
    height: '187cm', number: 7,
    stats: { goals: 135, assists: 42, wcGoals: 8, clubGoals25_26: 38 },
    facts: [
      'Record 214 international caps — most in men\'s football ever',
      'Record 135 international goals',
      'Joint record 6th World Cup — alongside Messi',
      '5× Ballon d\'Or winner',
      'Oldest player ever to score a WC hat-trick (2022 vs Spain)',
      'Scored 38 goals for Al Nassr in 2025-26 season at age 41'
    ],
    quote: '"Age is just a number. I still have hunger to score goals."'
  },
  'POR_Fernandes': {
    full: 'Bruno Fernandes', age: 31, pos: 'Midfielder', club: 'Man United', foot: 'Right',
    caps: 88, intlGoals: 22, wcGoals: 3, wcApps: 3,
    height: '179cm', number: 8,
    stats: { goals: 22, assists: 34, wcGoals: 3, clubGoals25_26: 16 },
    facts: [
      'Portugal\'s real creative heartbeat when Ronaldo steps back',
      'Man United\'s most important player for 5 years running',
      'Scored in Qatar 2022 vs Uruguay and Ghana',
      'Portuguese captain when Ronaldo rests'
    ],
    quote: null
  },

  // ── NETHERLANDS ──────────────────────────────────────────────────────────────
  'NED_vanDijk': {
    full: 'Virgil van Dijk', age: 34, pos: 'Defender', club: 'Liverpool', foot: 'Right',
    caps: 78, intlGoals: 10, wcGoals: 2, wcApps: 3,
    height: '193cm', number: 4,
    stats: { goals: 10, assists: 6, wcGoals: 2, clubGoals25_26: 4 },
    facts: [
      'Considered the world\'s best centre-back for several years',
      'Led Netherlands to 2022 WC QF and 2024 Euro SF',
      'Champions League winner with Liverpool (2019)',
      'Rarely beaten in 1v1 situations at international level',
      'Netherlands 3-time WC runners-up — never won it'
    ],
    quote: null
  },

  // ── USA ───────────────────────────────────────────────────────────────────────
  'USA_Pulisic': {
    full: 'Christian Pulisic', age: 27, pos: 'Winger', club: 'AC Milan', foot: 'Right',
    caps: 78, intlGoals: 28, wcGoals: 4, wcApps: 3,
    height: '177cm', number: 10,
    stats: { goals: 28, assists: 22, wcGoals: 4, clubGoals25_26: 16 },
    facts: [
      'USA\'s all-time leading scorer and most important player',
      'Nicknamed "Captain America" by US fans',
      'Serie A Player of the Year 2023-24 with AC Milan',
      'Playing at home at this World Cup — grew up in Pennsylvania',
      'Scored at both Russia 2018 and Qatar 2022'
    ],
    quote: '"This is a dream. Playing a World Cup on home soil."'
  },

  // ── CANADA ───────────────────────────────────────────────────────────────────
  'CAN_Davies': {
    full: 'Alphonso Davies', age: 25, pos: 'Left Back', club: 'Bayern Munich', foot: 'Left',
    caps: 62, intlGoals: 14, wcGoals: 0, wcApps: 1,
    height: '180cm', number: 3,
    stats: { goals: 14, assists: 22, wcGoals: 0, clubGoals25_26: 6 },
    facts: [
      'Born in a Ghanaian refugee camp — Canada\'s greatest ever player',
      'Won Bundesliga and Champions League with Bayern',
      'World\'s fastest footballer — clocked 36km/h',
      'Canada missed 2018 WC — Davies helped end 36-year absence in Qatar',
      'Playing as a co-host nation on home soil this summer'
    ],
    quote: '"Canada has never been better. This is our moment."'
  },

  // ── SCOTLAND ─────────────────────────────────────────────────────────────────
  'SCO_Robertson': {
    full: 'Andy Robertson', age: 32, pos: 'Left Back', club: 'Liverpool', foot: 'Left',
    caps: 72, intlGoals: 4, wcGoals: 0, wcApps: 1,
    height: '178cm', number: 3,
    stats: { goals: 4, assists: 18, wcGoals: 0, clubGoals25_26: 4 },
    facts: [
      'First World Cup since 1998 for Scotland — Robertson leads them back',
      'Champions League winner with Liverpool (2019)',
      'Won Premier League, FA Cup and League Cup with Liverpool',
      'Captain and heartbeat of this Scotland team',
      'One of the best left-backs in Premier League history'
    ],
    quote: '"We\'re back where we belong. Scotland at a World Cup."'
  },
  'SCO_McTominay': {
    full: 'Scott McTominay', age: 28, pos: 'Midfielder', club: 'Napoli', foot: 'Right',
    caps: 58, intlGoals: 18, wcGoals: 0, wcApps: 1,
    height: '193cm', number: 8,
    stats: { goals: 18, assists: 10, wcGoals: 0, clubGoals25_26: 16 },
    facts: [
      'Scotland\'s most clutch player — scored several last-minute WC qualifiers',
      'Won Serie A with Napoli in 2024-25 — standout season',
      'Scores big goals at key moments for Scotland',
      'Broke Scotland\'s hearts and then saved them — multiple times',
      'One of Napoli\'s best signings in years'
    ],
    quote: null
  },

  // ── MOROCCO ──────────────────────────────────────────────────────────────────
  'MAR_Hakimi': {
    full: 'Achraf Hakimi', age: 27, pos: 'Right Back', club: 'PSG', foot: 'Right',
    caps: 72, intlGoals: 14, wcGoals: 2, wcApps: 3,
    height: '181cm', number: 2,
    stats: { goals: 14, assists: 28, wcGoals: 2, clubGoals25_26: 8 },
    facts: [
      'Key figure in Morocco\'s historic 2022 WC semi-final run',
      'One of the best attacking right-backs in world football',
      'Won Champions League with Real Madrid and Inter Milan',
      'Morocco first African nation to reach a WC semi-final'
    ],
    quote: null
  },

  // ── BELGIUM ──────────────────────────────────────────────────────────────────
  'BEL_DeBruyne': {
    full: 'Kevin De Bruyne', age: 35, pos: 'Midfielder', club: 'Man City', foot: 'Right',
    caps: 102, intlGoals: 26, wcGoals: 4, wcApps: 4,
    height: '181cm', number: 7,
    stats: { goals: 26, assists: 62, wcGoals: 4, clubGoals25_26: 12 },
    facts: [
      'Belgium\'s greatest ever player — may be his final World Cup',
      'Multiple Premier League Player of the Season awards',
      'Won Champions League, 7 Premier Leagues with Man City',
      'Has never won a major tournament with Belgium',
      'Belgium reached 3rd place in Russia 2018 — their best ever'
    ],
    quote: '"I\'ve given everything for Belgium. I desperately want to win something."'
  },

  // ── JAPAN ────────────────────────────────────────────────────────────────────
  'JPN_Mitoma': {
    full: 'Kaoru Mitoma', age: 27, pos: 'Winger', club: 'Brighton', foot: 'Left',
    caps: 38, intlGoals: 12, wcGoals: 1, wcApps: 2,
    height: '178cm', number: 11,
    stats: { goals: 12, assists: 14, wcGoals: 1, clubGoals25_26: 14 },
    facts: [
      'Scored against Spain in Qatar 2022 group stage upset',
      'Studied sports science at university before turning pro',
      'One of the most direct dribblers in the Premier League',
      'Japan\'s most dangerous wide player going forward'
    ],
    quote: null
  },
};

// Helper to find player profile from team code + player name
function findPlayer(teamCode, playerName) {
  const lastName = playerName.split(' ').pop().replace(/[^a-zA-ZÀ-ÿ]/g,'');
  const key = teamCode + '_' + lastName;
  if (PLAYERS[key]) return PLAYERS[key];
  // Try first name match too
  const firstName = playerName.split(' ')[0];
  const key2 = teamCode + '_' + firstName;
  if (PLAYERS[key2]) return PLAYERS[key2];
  // Fuzzy: check if any key starts with teamCode and contains lastName
  return Object.entries(PLAYERS).find(([k,v]) =>
    k.startsWith(teamCode) && v.full.toLowerCase().includes(lastName.toLowerCase())
  )?.[1] || null;
}
