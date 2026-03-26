const matchCache = require('../cache/matchCache');
const scraperService = require('../services/scraperService');

// Request coalescing map — prevents thundering herd.
// Key = matchId (or matchId_stats), Value = in-flight Promise.
const activeScrapes = {};

/**
 * Helper: runs a scrape exactly once per key, sharing the promise with
 * all concurrent callers. Cleans up after resolution/rejection.
 */
async function scrapeOnce(key, scrapeFn) {
  if (activeScrapes[key]) {
    console.log(`[COALESCE] Joining existing scrape for ${key}`);
    return activeScrapes[key];
  }

  console.log(`[CACHE MISS] Scraping ${key}...`);
  activeScrapes[key] = scrapeFn();

  try {
    const result = await activeScrapes[key];
    return result;
  } finally {
    delete activeScrapes[key];
  }
}

exports.getPlayingXI = async (req, res) => {
  try {
    const matchId = req.params.id;

    // 1. Check permanent cache
    const cachedData = matchCache.getMatch(matchId);
    if (cachedData) {
      console.log(`[CACHE HIT] Returning XI for match ${matchId}`);
      return res.json({
        matchId,
        status: 'toss_done',
        teams: cachedData,
        cached: true
      });
    }

    // 2. Scrape once (coalesced)
    const scrapedTeams = await scrapeOnce(matchId, () =>
      scraperService.scrapePlayingXI(matchId)
    );

    // 3. Validate before caching
    if (
      !scrapedTeams ||
      !scrapedTeams.teamA ||
      !scrapedTeams.teamA.players ||
      scrapedTeams.teamA.players.length === 0
    ) {
      return res
        .status(404)
        .json({ error: 'Playing XI not available yet or could not be parsed.' });
    }

    // 4. Cache permanently
    matchCache.setMatch(matchId, scrapedTeams);

    return res.json({
      matchId,
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

    // 1. Check permanent cache
    const cachedStats = matchCache.getMatch(cacheKey);
    if (cachedStats) {
      console.log(`[CACHE HIT] Returning STATS for match ${matchId}`);
      return res.json({ matchId, ...cachedStats, cached: true });
    }

    // 2. Scrape once (coalesced)
    const stats = await scrapeOnce(cacheKey, () =>
      scraperService.scrapeMatchStats(matchId)
    );

    // 3. Validate before caching
    if (!stats) {
      return res
        .status(404)
        .json({ error: 'Stats not available or scorecard not found.' });
    }

    // 4. Cache permanently
    matchCache.setMatch(cacheKey, stats);
    return res.json({ matchId, ...stats, cached: false });
  } catch (error) {
    console.error('Error in getMatchStats:', error.message);
    res.status(500).json({ error: 'Failed to fetch Match Stats', message: error.message });
  }
};
