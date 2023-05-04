export const truncate = (address: string) => {
  if (!address) {
    return null
  } {
  const result = address.substring(0, 15)
  return `${result}...`
  }
}

export const addComma = (stringArr: string[]) => {
  if (!stringArr) {
    return null
  } else {
    var result = "";
    for (var i = 0; i < stringArr.length; i++) {
      if (i > 0) {
        result += ", ";
      }
      result += stringArr[i];
    }
    console.log(result);
  return result
  }
}