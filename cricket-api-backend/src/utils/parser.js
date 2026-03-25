/**
 * Parses the Cheerio DOM object to extract Playing XI
 */
exports.extractPlayingXI = ($) => {
  const result = {
    teamA: { name: 'Unknown A', players: [] },
    teamB: { name: 'Unknown B', players: [] }
  };

  try {
    // Cricbuzz typically structures Squads in a recognizable block under "Playing" or "Squads"
    // e.g., <div class="cb-col cb-col-100 cb-minfo-tm-nm"> <a href="...">TEAM NAME</a> Squad </div>
    // e.g., <div class="cb-col cb-col-100 cb-minfo-tm-nm"> <a href="...">TEAM NAME</a> Playing </div>
    // Let's look for "Playing" text or standard DOM structures used by Cricbuzz on the scoreboard page.

    // A common structure for Playing XI on their match page:
    // <div class="cb-col-100 cb-col cb-nav-main cb-bg-white">
    // Inside a panel, there are div elements with class "cb-minfo-tm-nm"
    
    // Since Cricbuzz DOM can vary, we will scan text nodes specifically looking for 'Playing' or 'Squad' followed by player names.
    // However, the standard layout on the live scores page has squads listed on the right side or bottom of the live commentary.
    
    // Attempt 1: Look for exact blocks that contain the text "Playing"
    // Many times it's inside: <div class="cb-col cb-col-100 cb-minfo-tm-nm"> 
    // And the players are in the immediate next sibling block containing player links.

    const squadHeaders = $('.cb-col.cb-col-100.cb-minfo-tm-nm');
    
    let currentTeamKey = 'teamA';

    squadHeaders.each((i, elem) => {
      const headerText = $(elem).text().trim();
      
      // Look for headers like "IND Playing" or "AUS Playing"
      if (headerText.toLowerCase().includes('playing')) {
        const teamName = headerText.replace(/Playing/i, '').trim();
        
        // The players are usually in the next sibling element containing links
        const nextElem = $(elem).next();
        const playersText = nextElem.text() || '';
        
        // Clean player names:
        // "Rohit Sharma (c), Shubman Gill, Virat Kohli, ..."
        // Split by comma
        const playersList = playersText
          .split(',')
          .map(p => p.trim())
          .filter(p => p.length > 0);
          
        if (currentTeamKey === 'teamA') {
          result.teamA.name = teamName || 'Team A';
          result.teamA.players = playersList;
          currentTeamKey = 'teamB'; // Next one will be Team B
        } else if (currentTeamKey === 'teamB') {
          result.teamB.name = teamName || 'Team B';
          result.teamB.players = playersList;
        }
      }
    });

  } catch (error) {
    console.error('Extraction error:', error);
  }

  return result;
};

exports.extractMatchStats = ($) => {
  const stats = {
    winner: null,
    highestRunScorer: { name: '', runs: -1 },
    mostSixes: { name: '', sixes: -1 },
    mostFours: { name: '', fours: -1 },
    mostWickets: { name: '', wickets: -1 },
  };

  try {
    // 1. Get Match Winner / Status text
    stats.winner = $('.cb-scrcrd-status').text().trim() || $('.cb-text-complete').text().trim() || 'Pending';

    // 2. Iterate all sections to distinguish Batting vs Bowling
    $('.cb-ltst-wgt-hdr').each((i, section) => {
      const headerText = $(section).find('.cb-scrd-itms .cb-col-100').first().text().trim() || 
                         $(section).find('.cb-scrd-itms').first().text().trim();
      
      const isBatting = headerText.includes('Batter') || headerText.includes('Batsman');
      const isBowling = headerText.includes('Bowler');

      $(section).find('.cb-scrd-itms').each((j, row) => {
        const cols = $(row).find('.cb-col');
        if (cols.length < 5) return;

        const nameRaw = $(cols[0]).text().trim();
        // Skip header rows or totals
        if (nameRaw === 'Batter' || nameRaw === 'Bowler' || nameRaw.includes('Extras') || nameRaw.includes('Total') || nameRaw.includes('Did not Bat')) return;
        
        const cleanName = nameRaw.replace(/\(c\)|\(wk\)|\(sub\)/gi, '').trim();

        if (isBatting) {
          // Columns: 0:Name, 1:Dismissal, 2:R, 3:B, 4:4s, 5:6s, 6:SR
          const runs = parseInt($(cols[2]).text().trim(), 10);
          const fours = parseInt($(cols[4]).text().trim(), 10);
          const sixes = parseInt($(cols[5]).text().trim(), 10);

          if (!isNaN(runs) && runs > stats.highestRunScorer.runs) {
            stats.highestRunScorer = { name: cleanName, runs };
          }
          if (!isNaN(fours) && fours > stats.mostFours.fours) {
            stats.mostFours = { name: cleanName, fours };
          }
          if (!isNaN(sixes) && sixes > stats.mostSixes.sixes) {
            stats.mostSixes = { name: cleanName, sixes };
          }
        } 
        else if (isBowling) {
          // Columns: 0:Name, 1:O, 2:M, 3:R, 4:W, 5:NB, 6:WD, 7:ECO
          const wickets = parseInt($(cols[4]).text().trim(), 10);
          if (!isNaN(wickets) && wickets > stats.mostWickets.wickets) {
            stats.mostWickets = { name: cleanName, wickets };
          }
        }
      });
    });

  } catch (error) {
    console.error('Match stats extraction error:', error);
  }

  return stats;
};
