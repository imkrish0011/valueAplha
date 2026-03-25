const matchCache = require('../cache/matchCache');
const scraperService = require('../services/scraperService');

exports.getPlayingXI = async (req, res) => {
  try {
    const matchId = req.params.id;

    // RULE 3: ALWAYS USE CACHE
    const cachedData = matchCache.getMatch(matchId);
    if (cachedData) {
      console.log(`[CACHE HIT] Returning XI for match ${matchId}`);
      return res.json({
        matchId: matchId,
        status: 'toss_done',
        teams: cachedData,
        cached: true
      });
    }

    // RULE 1: SCRAPE ONLY ONCE
    console.log(`[CACHE MISS] Scraping XI for match ${matchId}...`);
    const scrapedTeams = await scraperService.scrapePlayingXI(matchId);

    if (!scrapedTeams || !scrapedTeams.teamA || !scrapedTeams.teamA.players || scrapedTeams.teamA.players.length === 0) {
      return res.status(404).json({ error: 'Playing XI not available yet or could not be parsed.' });
    }

    // RULE 2: CACHE FOREVER
    matchCache.setMatch(matchId, scrapedTeams);

    return res.json({
      matchId: matchId,
      status: 'toss_done',
      teams: scrapedTeams,
      cached: false
    });
  } catch (error) {
    console.error('Error in getPlayingXI:', error.message);
    res.status(500).json({ error: 'Failed to fetch Playing XI', message: error.message });
  }
};

exports.getMatchStats = async (req, res) => {
  try {
    const matchId = req.params.id;
    const cacheKey = matchId + '_stats';
    
    const cachedStats = matchCache.getMatch(cacheKey);
    if (cachedStats) {
      console.log(`[CACHE HIT] Returning STATS for match ${matchId}`);
      return res.json({ matchId, ...cachedStats, cached: true });
    }

    console.log(`[CACHE MISS] Scraping STATS for match ${matchId}...`);
    const stats = await scraperService.scrapeMatchStats(matchId);
    
    if (!stats) {
      return res.status(404).json({ error: 'Stats not available or scorecard not found.' });
    }

    // Cache the stats with the same 5 min TTL
    matchCache.setMatch(cacheKey, stats);
    return res.json({ matchId, ...stats, cached: false });
    
  } catch (error) {
    console.error('Error in getMatchStats:', error.message);
    res.status(500).json({ error: 'Failed to fetch Match Stats', message: error.message });
  }
};
