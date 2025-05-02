const formatTimeForDisplay = (date) => {
    if (!date) return "";
  
    const d = new Date(date);
    if (isNaN(d)) return "";
  
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    
    const period = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert to 12-hour format
    
    return `${formattedHours}:${minutes} ${period}`;
  };
  
  export default formatTimeForDisplay;
  