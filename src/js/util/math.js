export const choicew = (weights) => {
  const threshold =
    Math.random() * Object.values(weights).reduce((sum, p) => sum + p, 0)

  let total = 0
  const entries = Object.entries(weights)
  for (let i = 0; i < entries.length - 1; ++i) {
    total += entries[i][1]
    if (total >= threshold) return entries[i][0]
  }
  return entries[entries.length - 1][0]
}
