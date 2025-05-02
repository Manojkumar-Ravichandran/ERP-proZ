const formatDateForInput = (date) => {
    if (!date) return ""; 
    const d = new Date(date);
    if (isNaN(d)) return "";
    return d.toISOString().split('T')[0];
};

export default formatDateForInput;


