export const truncate = (address : string ) => {
  const result = address.substring(0, 15)
  return `${result}...`
}