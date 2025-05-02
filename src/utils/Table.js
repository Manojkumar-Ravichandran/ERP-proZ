const measureTextWidth = (text, font = "14px Arial") => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    return context.measureText(text).width;
  };
export  const calculateColumnWidth = (field, data, padding = 20) => {
  if(data){
    const maxWidth = Math.max(
      ...data?.map((row) => measureTextWidth(String(row[field])))
    );
    return Math.min(Math.max(maxWidth + padding, 100), 300); // Set minWidth and maxWidth limits

  }
  };