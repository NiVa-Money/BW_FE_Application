export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);

  // Extract date components
  const secs = String(date.getSeconds()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} at ${hours}:${minutes}:${secs}`;
};

export const camelCaseToWords = (camelCaseString) => {
  if (!camelCaseString || typeof camelCaseString !== "string") {
    return camelCaseString;
  }
  // Add a space before capital letters and capitalize the first letter
  const formattedString = camelCaseString
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  return formattedString.trim(); // Remove any leading/trailing spaces
};
