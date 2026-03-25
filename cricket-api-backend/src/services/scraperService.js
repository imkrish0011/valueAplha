const axios = require('axios');
const cheerio = require('cheerio');
const parser = require('../utils/parser');

/**
 * Scrape Playing XI from Cricbuzz
 * Example route ID format: cbz-12345 or just 12345. Let's assume the client passes the exact numeric ID.
 * The Cricbuzz live scores URL format is typically: 
 * https://www.cricbuzz.com/cricket-match-facts/{matchId}/any-string
 * Actually, the "Playing XI" is found on the main match page or the "facts" page.
 * Wait, the main scores page usually has it in a <div> once the toss is done:
 * https://www.cricbuzz.com/live-cricket-scores/{matchId}
 */
exports.scrapePlayingXI = async (matchId) => {
  try {
    const url = `https://www.cricbuzz.com/live-cricket-scores/${matchId}`;
    console.log(`Fetching HTML from ${url}...`);
    
    // Add User-Agent to prevent 403s
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Parse the DOM using the parser utility
    const teamsData = parser.extractPlayingXI($);
    
    return teamsData;
  } catch (error) {
    console.error('Error in scraperService setup:', error.message);
    throw error;
  }
};

exports.scrapeMatchStats = async (matchId) => {
  try {
    const url = `https://www.cricbuzz.com/live-cricket-scorecard/${matchId}`;
    console.log(`Fetching Scorecard HTML from ${url}...`);
    
    // Add User-Agent to prevent 403s
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    return parser.extractMatchStats($);
  } catch (error) {
    console.error('Error scraping match stats:', error.message);
    return null;
  }
};
