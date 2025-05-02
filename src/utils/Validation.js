export const validationPatterns = {
    textOnly: /^[a-zA-Z\s]{3,}$/,
    numberOnly: /^[0-9]+$/,
    textwithNumberOnly: /^[a-zA-Z\d\s]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    contactNumber: /^[6789](?!.*(\d)\1{4})\d{9}$/,
    aadhar: /^(?!.*(\d)\1{4})\d{12}$/,
    pan: /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/,
    gstNo: /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}Z[0-9a-zA-Z]{1}$/,
    pincode: /^[1-9]\d{5}$/,
    spacePattern: /^(?!\s*$).+/,
    hsnCode: /^[0-9]{4,8}$/,
    percentage: /^(100(\.0{1,2})?|[0-9]{1,2}(\.\d{1,2})?)$/,
    vehicleNumber: /^[A-Z]{2}\d{1,2}[A-Z]{0,2}\d{4}$/

};
