export const truncate = (address : string ) => {
  const result = address.substring(0, 5)
  return `${result}...`
}