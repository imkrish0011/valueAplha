// IPL 2026 match schedule
export const MATCH_SCHEDULE = [
  { id: 'm1', teamA: { name: 'Royal Challengers Bengaluru', short: 'RCB' }, teamB: { name: 'Sunrisers Hyderabad', short: 'SRH' }, date: 'Mar 28, 2026', time: '19:30', venue: 'M. Chinnaswamy Stadium, Bengaluru', league: 'TATA IPL 2026' },
  { id: 'm2', teamA: { name: 'Mumbai Indians', short: 'MI' }, teamB: { name: 'Kolkata Knight Riders', short: 'KKR' }, date: 'Mar 29, 2026', time: '19:30', venue: 'Wankhede Stadium, Mumbai', league: 'TATA IPL 2026' },
  { id: 'm3', teamA: { name: 'Rajasthan Royals', short: 'RR' }, teamB: { name: 'Chennai Super Kings', short: 'CSK' }, date: 'Mar 30, 2026', time: '19:30', venue: 'ACA Stadium, Guwahati', league: 'TATA IPL 2026' },
  { id: 'm4', teamA: { name: 'Punjab Kings', short: 'PBKS' }, teamB: { name: 'Gujarat Titans', short: 'GT' }, date: 'Mar 31, 2026', time: '19:30', venue: 'Maharaja Yadavindra Singh Stadium, Mullanpur', league: 'TATA IPL 2026' },
  { id: 'm5', teamA: { name: 'Lucknow Super Giants', short: 'LSG' }, teamB: { name: 'Delhi Capitals', short: 'DC' }, date: 'Apr 01, 2026', time: '19:30', venue: 'Ekana Cricket Stadium, Lucknow', league: 'TATA IPL 2026' },
  { id: 'm6', teamA: { name: 'Chennai Super Kings', short: 'CSK' }, teamB: { name: 'Mumbai Indians', short: 'MI' }, date: 'Apr 02, 2026', time: '19:30', venue: 'MA Chidambaram Stadium, Chennai', league: 'TATA IPL 2026' },
  { id: 'm7', teamA: { name: 'Delhi Capitals', short: 'DC' }, teamB: { name: 'Royal Challengers Bengaluru', short: 'RCB' }, date: 'Apr 03, 2026', time: '19:30', venue: 'Arun Jaitley Stadium, Delhi', league: 'TATA IPL 2026' },
  { id: 'm8', teamA: { name: 'Gujarat Titans', short: 'GT' }, teamB: { name: 'Rajasthan Royals', short: 'RR' }, date: 'Apr 04, 2026', time: '19:30', venue: 'Narendra Modi Stadium, Ahmedabad', league: 'TATA IPL 2026' },
];

// Key players per team (used for prediction categories)
export const TEAM_PLAYERS = {
  RCB: [
    { id: 'rcb1', name: 'Virat Kohli', role: 'Batter' },
    { id: 'rcb2', name: 'Rajat Patidar', role: 'Batter' },
    { id: 'rcb3', name: 'Phil Salt', role: 'WK-Batter' },
    { id: 'rcb4', name: 'Liam Livingstone', role: 'All-rounder' },
    { id: 'rcb5', name: 'Krunal Pandya', role: 'All-rounder' },
    { id: 'rcb6', name: 'Bhuvneshwar Kumar', role: 'Bowler' },
    { id: 'rcb7', name: 'Josh Hazlewood', role: 'Bowler' },
    { id: 'rcb8', name: 'Suyash Prabhudessai', role: 'Batter' },
    { id: 'rcb9', name: 'Swapnil Singh', role: 'All-rounder' },
    { id: 'rcb10', name: 'Yash Dayal', role: 'Bowler' },
    { id: 'rcb11', name: 'Rasikh Salam', role: 'Bowler' },
    { id: 'rcb12', name: 'Tim David', role: 'Batter' },
    { id: 'rcb13', name: 'Romario Shepherd', role: 'All-rounder' },
    { id: 'rcb14', name: 'Devdutt Padikkal', role: 'Batter' },
    { id: 'rcb15', name: 'Manoj Bhandage', role: 'All-rounder' },
  ],
  SRH: [
    { id: 'srh1', name: 'Travis Head', role: 'Batter' },
    { id: 'srh2', name: 'Abhishek Sharma', role: 'All-rounder' },
    { id: 'srh3', name: 'Heinrich Klaasen', role: 'WK-Batter' },
    { id: 'srh4', name: 'Pat Cummins', role: 'Bowler' },
    { id: 'srh5', name: 'Nitish Kumar Reddy', role: 'All-rounder' },
    { id: 'srh6', name: 'Mohammed Shami', role: 'Bowler' },
    { id: 'srh7', name: 'Ishan Kishan', role: 'WK-Batter' },
    { id: 'srh8', name: 'Abdul Samad', role: 'Batter' },
    { id: 'srh9', name: 'Shahbaz Ahmed', role: 'All-rounder' },
    { id: 'srh10', name: 'T Natarajan', role: 'Bowler' },
    { id: 'srh11', name: 'Mayank Markande', role: 'Bowler' },
    { id: 'srh12', name: 'Jaydev Unadkat', role: 'Bowler' },
    { id: 'srh13', name: 'Fazalhaq Farooqi', role: 'Bowler' },
    { id: 'srh14', name: 'Rahul Tripathi', role: 'Batter' },
    { id: 'srh15', name: 'Washington Sundar', role: 'All-rounder' },
  ],
  MI: [
    { id: 'mi1', name: 'Rohit Sharma', role: 'Batter' },
    { id: 'mi2', name: 'Suryakumar Yadav', role: 'Batter' },
    { id: 'mi3', name: 'Tilak Varma', role: 'Batter' },
    { id: 'mi4', name: 'Hardik Pandya', role: 'All-rounder' },
    { id: 'mi5', name: 'Jasprit Bumrah', role: 'Bowler' },
    { id: 'mi6', name: 'Trent Boult', role: 'Bowler' },
    { id: 'mi7', name: 'Naman Dhir', role: 'All-rounder' },
    { id: 'mi8', name: 'Ryan Rickelton', role: 'WK-Batter' },
    { id: 'mi9', name: 'Robin Minz', role: 'WK-Batter' },
    { id: 'mi10', name: 'Deepak Chahar', role: 'Bowler' },
    { id: 'mi11', name: 'Karn Sharma', role: 'Bowler' },
    { id: 'mi12', name: 'Will Jacks', role: 'All-rounder' },
    { id: 'mi13', name: 'Nuwan Thushara', role: 'Bowler' },
    { id: 'mi14', name: 'Mitchell Santner', role: 'Bowler' },
    { id: 'mi15', name: 'Reece Topley', role: 'Bowler' },
  ],
  KKR: [
    { id: 'kkr1', name: 'Shreyas Iyer', role: 'Batter' },
    { id: 'kkr2', name: 'Venkatesh Iyer', role: 'All-rounder' },
    { id: 'kkr3', name: 'Andre Russell', role: 'All-rounder' },
    { id: 'kkr4', name: 'Sunil Narine', role: 'All-rounder' },
    { id: 'kkr5', name: 'Quinton de Kock', role: 'WK-Batter' },
    { id: 'kkr6', name: 'Varun Chakravarthy', role: 'Bowler' },
    { id: 'kkr7', name: 'Mitchell Starc', role: 'Bowler' },
    { id: 'kkr8', name: 'Ramandeep Singh', role: 'All-rounder' },
    { id: 'kkr9', name: 'Harshit Rana', role: 'Bowler' },
    { id: 'kkr10', name: 'Rinku Singh', role: 'Batter' },
    { id: 'kkr11', name: 'Suyash Sharma', role: 'Bowler' },
    { id: 'kkr12', name: 'Manish Pandey', role: 'Batter' },
    { id: 'kkr13', name: 'Anukul Roy', role: 'All-rounder' },
    { id: 'kkr14', name: 'Vaibhav Arora', role: 'Bowler' },
    { id: 'kkr15', name: 'Rovman Powell', role: 'Batter' },
  ],
  RR: [
    { id: 'rr1', name: 'Sanju Samson', role: 'WK-Batter' },
    { id: 'rr2', name: 'Yashasvi Jaiswal', role: 'Batter' },
    { id: 'rr3', name: 'Jos Buttler', role: 'WK-Batter' },
    { id: 'rr4', name: 'Shimron Hetmyer', role: 'Batter' },
    { id: 'rr5', name: 'R Ashwin', role: 'Bowler' },
    { id: 'rr6', name: 'Jofra Archer', role: 'Bowler' },
    { id: 'rr7', name: 'Riyan Parag', role: 'All-rounder' },
    { id: 'rr8', name: 'Dhruv Jurel', role: 'WK-Batter' },
    { id: 'rr9', name: 'Sandeep Sharma', role: 'Bowler' },
    { id: 'rr10', name: 'Maheesh Theekshana', role: 'Bowler' },
    { id: 'rr11', name: 'Akash Madhwal', role: 'Bowler' },
    { id: 'rr12', name: 'Kumar Kushagra', role: 'WK-Batter' },
    { id: 'rr13', name: 'Wanindu Hasaranga', role: 'All-rounder' },
    { id: 'rr14', name: 'Avesh Khan', role: 'Bowler' },
    { id: 'rr15', name: 'Fazalhaq Farooqi', role: 'Bowler' },
  ],
  CSK: [
    { id: 'csk1', name: 'Ruturaj Gaikwad', role: 'Batter' },
    { id: 'csk2', name: 'Devon Conway', role: 'Batter' },
    { id: 'csk3', name: 'Shivam Dube', role: 'All-rounder' },
    { id: 'csk4', name: 'Ravindra Jadeja', role: 'All-rounder' },
    { id: 'csk5', name: 'MS Dhoni', role: 'WK-Batter' },
    { id: 'csk6', name: 'Matheesha Pathirana', role: 'Bowler' },
    { id: 'csk7', name: 'Rachin Ravindra', role: 'All-rounder' },
    { id: 'csk8', name: 'Daryl Mitchell', role: 'All-rounder' },
    { id: 'csk9', name: 'Tushar Deshpande', role: 'Bowler' },
    { id: 'csk10', name: 'Maheesh Theekshana', role: 'Bowler' },
    { id: 'csk11', name: 'Sameer Rizvi', role: 'Batter' },
    { id: 'csk12', name: 'Shardul Thakur', role: 'All-rounder' },
    { id: 'csk13', name: 'Mukesh Choudhary', role: 'Bowler' },
    { id: 'csk14', name: 'Ajinkya Rahane', role: 'Batter' },
    { id: 'csk15', name: 'Mustafizur Rahman', role: 'Bowler' },
  ],
  PBKS: [
    { id: 'pbks1', name: 'Shikhar Dhawan', role: 'Batter' },
    { id: 'pbks2', name: 'Jonny Bairstow', role: 'WK-Batter' },
    { id: 'pbks3', name: 'Liam Livingstone', role: 'All-rounder' },
    { id: 'pbks4', name: 'Sam Curran', role: 'All-rounder' },
    { id: 'pbks5', name: 'Kagiso Rabada', role: 'Bowler' },
    { id: 'pbks6', name: 'Arshdeep Singh', role: 'Bowler' },
    { id: 'pbks7', name: 'Prabhsimran Singh', role: 'WK-Batter' },
    { id: 'pbks8', name: 'Jitesh Sharma', role: 'WK-Batter' },
    { id: 'pbks9', name: 'Harshal Patel', role: 'Bowler' },
    { id: 'pbks10', name: 'Rahul Chahar', role: 'Bowler' },
    { id: 'pbks11', name: 'Ashutosh Sharma', role: 'Batter' },
    { id: 'pbks12', name: 'Shashank Singh', role: 'Batter' },
    { id: 'pbks13', name: 'Nathan Ellis', role: 'Bowler' },
    { id: 'pbks14', name: 'Harpreet Brar', role: 'All-rounder' },
    { id: 'pbks15', name: 'Rilee Rossouw', role: 'Batter' },
  ],
  GT: [
    { id: 'gt1', name: 'Shubman Gill', role: 'Batter' },
    { id: 'gt2', name: 'David Miller', role: 'Batter' },
    { id: 'gt3', name: 'Rashid Khan', role: 'All-rounder' },
    { id: 'gt4', name: 'Mohammed Siraj', role: 'Bowler' },
    { id: 'gt5', name: 'Wriddhiman Saha', role: 'WK-Batter' },
    { id: 'gt6', name: 'Sai Sudharsan', role: 'Batter' },
    { id: 'gt7', name: 'Rahul Tewatia', role: 'All-rounder' },
    { id: 'gt8', name: 'Shahrukh Khan', role: 'Batter' },
    { id: 'gt9', name: 'Mohit Sharma', role: 'Bowler' },
    { id: 'gt10', name: 'Noor Ahmad', role: 'Bowler' },
    { id: 'gt11', name: 'Azmatullah Omarzai', role: 'All-rounder' },
    { id: 'gt12', name: 'Umesh Yadav', role: 'Bowler' },
    { id: 'gt13', name: 'Spencer Johnson', role: 'Bowler' },
    { id: 'gt14', name: 'Kane Williamson', role: 'Batter' },
    { id: 'gt15', name: 'Joshua Little', role: 'Bowler' },
  ],
  LSG: [
    { id: 'lsg1', name: 'KL Rahul', role: 'WK-Batter' },
    { id: 'lsg2', name: 'Nicholas Pooran', role: 'WK-Batter' },
    { id: 'lsg3', name: 'Marcus Stoinis', role: 'All-rounder' },
    { id: 'lsg4', name: 'Ravi Bishnoi', role: 'Bowler' },
    { id: 'lsg5', name: 'Mark Wood', role: 'Bowler' },
    { id: 'lsg6', name: 'Ayush Badoni', role: 'Batter' },
    { id: 'lsg7', name: 'Krunal Pandya', role: 'All-rounder' },
    { id: 'lsg8', name: 'Mohsin Khan', role: 'Bowler' },
    { id: 'lsg9', name: 'Naveen-ul-Haq', role: 'Bowler' },
    { id: 'lsg10', name: 'Deepak Hooda', role: 'All-rounder' },
    { id: 'lsg11', name: 'Mayank Yadav', role: 'Bowler' },
    { id: 'lsg12', name: 'Yudhvir Singh', role: 'Bowler' },
    { id: 'lsg13', name: 'Kyle Mayers', role: 'All-rounder' },
    { id: 'lsg14', name: 'Ashton Turner', role: 'Batter' },
    { id: 'lsg15', name: 'Prerak Mankad', role: 'All-rounder' },
  ],
  DC: [
    { id: 'dc1', name: 'Rishabh Pant', role: 'WK-Batter' },
    { id: 'dc2', name: 'Axar Patel', role: 'All-rounder' },
    { id: 'dc3', name: 'Kuldeep Yadav', role: 'Bowler' },
    { id: 'dc4', name: 'Anrich Nortje', role: 'Bowler' },
    { id: 'dc5', name: 'Jake Fraser-McGurk', role: 'Batter' },
    { id: 'dc6', name: 'Tristan Stubbs', role: 'WK-Batter' },
    { id: 'dc7', name: 'Khaleel Ahmed', role: 'Bowler' },
    { id: 'dc8', name: 'Mukesh Kumar', role: 'Bowler' },
    { id: 'dc9', name: 'Abishek Porel', role: 'WK-Batter' },
    { id: 'dc10', name: 'Ishant Sharma', role: 'Bowler' },
    { id: 'dc11', name: 'Shai Hope', role: 'WK-Batter' },
    { id: 'dc12', name: 'Pravin Dubey', role: 'All-rounder' },
    { id: 'dc13', name: 'Rishabh Pant', role: 'WK-Batter' },
    { id: 'dc14', name: 'Ricky Bhui', role: 'Batter' },
    { id: 'dc15', name: 'Lalit Yadav', role: 'All-rounder' },
  ],
};

export function getMatchStatus(dateStr) {
  const matchDate = new Date(dateStr);
  const now = new Date();
  if (now > matchDate) return 'completed';
  const diff = matchDate - now;
  if (diff < 86400000) return 'live';
  return 'upcoming';
}

export function getMatchById(id) {
  const match = MATCH_SCHEDULE.find(m => m.id === id);
  if (!match) return null;
  return { ...match, status: getMatchStatus(match.date) };
}

export function getPlayersForMatch(match) {
  const teamAPlayers = TEAM_PLAYERS[match.teamA.short] || [];
  const teamBPlayers = TEAM_PLAYERS[match.teamB.short] || [];
  return [...teamAPlayers, ...teamBPlayers];
}

export function getTimeUntilMatch(dateStr, timeStr, showSeconds = false) {
  const [hours, mins] = timeStr.split(':');
  const matchDate = new Date(dateStr);
  matchDate.setHours(parseInt(hours), parseInt(mins), 0);
  const diff = matchDate - new Date();
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (showSeconds) {
    if (days > 0) return `${days}d ${hrs}h ${minutes}m ${seconds}s`;
    return `${hrs.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  if (days > 0) return `${days}d ${hrs}h`;
  if (hrs > 0) return `${hrs}h ${minutes}m`;
  return `${minutes}m`;
}

export function getPredictionWindow(dateStr, timeStr) {
  const [hours, mins] = timeStr.split(':');
  const matchDate = new Date(dateStr);
  matchDate.setHours(parseInt(hours), parseInt(mins), 0);
  const now = new Date();
  
  // Prediction opens 7 hours before match time
  const openTime = new Date(matchDate.getTime() - 7 * 60 * 60 * 1000);
  // Prediction closes 30 minutes before match time (at toss)
  const closeTime = new Date(matchDate.getTime() - 30 * 60 * 1000);
  
  if (now < openTime) {
    return { status: 'too_early', timeUntilEvent: openTime.getTime() - now.getTime() };
  } else if (now >= openTime && now < closeTime) {
    return { status: 'open', timeUntilEvent: closeTime.getTime() - now.getTime() };
  } else {
    return { status: 'closed', timeUntilEvent: 0 };
  }
}

export function formatTimeDiff(diffMs) {
  if (diffMs <= 0) return null;
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
