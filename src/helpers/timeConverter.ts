export function stringToMinutes(hour: string) {
  const [hours, minutes] = hour.split(":").map(Number)
  return hours * 60 + minutes
}

export function minutesToString(minutes: number) {
  //const [hours, minutes] = hour.split(":").map(Number)
  return 0 //hours * 60 + minutes
}
