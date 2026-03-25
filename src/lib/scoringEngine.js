export const SCORING_RULES = {
  CORRECT_WINNER: 10,
  CORRECT_MOST_RUNS: 20,
  CORRECT_MOST_WICKETS: 20,
  CORRECT_MOST_SIXES: 15,
  CORRECT_MOST_FOURS: 15,
  PERFECT_BONUS: 20,
  ONE_WICKET_MARGIN_BONUS: 5,
  NON_STARTER_PENALTY: -15,
};

/**
 * Calculates the total points a user earned for a single match prediction.
 * @param {Object} prediction - The user's prediction row from the database
 * @param {Object} matchResult - The actual match result data (from API/backend)
 * @param {Array} matchPlayers - List of all players in the match (to check starting 12)
 * @returns {Object} Score breakdown and total points
 */
export function calculatePredictionPoints(prediction, matchResult, matchPlayers = []) {
  if (!prediction || !matchResult || matchResult.status !== 'completed') {
    return { total: 0, breakdown: {}, isPerfect: false };
  }

  let totalPoints = 0;
  const breakdown = {};
  let correctCount = 0;
  let attemptedCount = 0;

  // 1. Match Winner (10 pts)
  if (prediction.winner) {
    attemptedCount++;
    if (prediction.winner === matchResult.winner) {
      totalPoints += SCORING_RULES.CORRECT_WINNER;
      breakdown.winner = SCORING_RULES.CORRECT_WINNER;
      correctCount++;
    }
  }

  // Helper to check player predictions
  const evaluatePlayerCategory = (predValue, actualValue, points, key) => {
    if (predValue) {
      attemptedCount++;
      // Check for non-starter penalty (if we have player data to verify)
      const didPlayerStart = matchPlayers.length === 0 || matchPlayers.some(p => p.name === predValue && p.isStarter !== false);
      
      if (!didPlayerStart) {
        totalPoints += SCORING_RULES.NON_STARTER_PENALTY;
        breakdown[key] = SCORING_RULES.NON_STARTER_PENALTY;
        return;
      }

      if (predValue === actualValue) {
        totalPoints += points;
        breakdown[key] = points;
        correctCount++;
      }
    }
  };

  // 2. Most Runs (20 pts)
  evaluatePlayerCategory(prediction.most_runs, matchResult.mostRuns, SCORING_RULES.CORRECT_MOST_RUNS, 'mostRuns');
  
  // 3. Most Wickets (20 pts)
  evaluatePlayerCategory(prediction.most_wickets, matchResult.mostWickets, SCORING_RULES.CORRECT_MOST_WICKETS, 'mostWickets');
  
  // 4. Most Sixes (15 pts)
  evaluatePlayerCategory(prediction.most_sixes, matchResult.mostSixes, SCORING_RULES.CORRECT_MOST_SIXES, 'mostSixes');
  
  // 5. Most Fours (15 pts)
  evaluatePlayerCategory(prediction.most_fours, matchResult.mostFours, SCORING_RULES.CORRECT_MOST_FOURS, 'mostFours');

  // Perfect Prediction Bonus (all 5 correct)
  const isPerfect = attemptedCount === 5 && correctCount === 5;
  if (isPerfect) {
    totalPoints += SCORING_RULES.PERFECT_BONUS;
    breakdown.perfectBonus = SCORING_RULES.PERFECT_BONUS;
  }

  return {
    total: Math.max(0, totalPoints), // Prevent negative total score for a match? Or allow negative? Let's allow negative if they get penalty.
    rawTotal: totalPoints,
    breakdown,
    isPerfect,
    correctCount,
    attemptedCount
  };
}
