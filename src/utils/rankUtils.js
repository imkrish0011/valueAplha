export function getUserRank(points) {
  const pts = points || 0;
  if (pts >= 301) return { title: 'God of Toss', icon: '👑' };
  if (pts >= 151) return { title: 'Cricket Oracle', icon: '🔮' };
  if (pts >= 51) return { title: 'Analyst', icon: '🧐' };
  return { title: 'Rookie', icon: '👶' };
}
