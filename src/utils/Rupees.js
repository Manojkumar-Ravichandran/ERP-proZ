// Function to format number as INR
export const formatToINRwithRupees = (number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(number);
};

export const formatToINR = (number) => { 
    return new Intl.NumberFormat('en-IN', {
         minimumFractionDigits: 2, maximumFractionDigits: 2 
    }).format(number); 
};


