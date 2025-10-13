// Test duration calculation to verify the fix
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime)
  const end = new Date(endTime)
  
  // Set time to start of day for consistent calculation
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  
  const diffInMs = end.getTime() - start.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  
  // Return 1 day for same-day rentals, otherwise exact days
  return Math.max(1, Math.ceil(diffInDays))
}

// Test cases
console.log("=== Duration Calculation Tests ===")
console.log()

// Same day rental (should be 1 day)
console.log("Same day rental (Dec 15 to Dec 15):", calculateDuration("2024-12-15T10:00:00", "2024-12-15T18:00:00"), "days")

// 1 day rental (pickup today, return tomorrow)
console.log("1 day rental (Dec 15 to Dec 16):", calculateDuration("2024-12-15T10:00:00", "2024-12-16T10:00:00"), "days")

// 2 day rental 
console.log("2 day rental (Dec 15 to Dec 17):", calculateDuration("2024-12-15T10:00:00", "2024-12-17T10:00:00"), "days")

// 3 day rental
console.log("3 day rental (Dec 15 to Dec 18):", calculateDuration("2024-12-15T10:00:00", "2024-12-18T10:00:00"), "days")

// Weekend rental (Friday to Monday)
console.log("Weekend rental (Dec 13 to Dec 16):", calculateDuration("2024-12-13T10:00:00", "2024-12-16T10:00:00"), "days")

console.log()
console.log("=== Previous (Broken) Calculation ===")

function oldCalculateDuration(startTime, endTime) {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffInMs = end - start
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
  return diffInDays
}

console.log("Same day (old):", oldCalculateDuration("2024-12-15T10:00:00", "2024-12-15T18:00:00"), "days")
console.log("1 day (old):", oldCalculateDuration("2024-12-15T10:00:00", "2024-12-16T10:00:00"), "days")
