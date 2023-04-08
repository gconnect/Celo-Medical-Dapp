
export const formateDateTime = (timestamp: any) => {
  // create a new date object with the timestamp
  const date = new Date(timestamp * 1000);
  // format the date as a string in the desired format
  const formattedDate = date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

  console.log(formattedDate);
  return formattedDate
}
