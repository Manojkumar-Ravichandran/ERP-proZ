/* TRIANGLE AREA CALCULATION */
export function triangleArea(base, height) {
    return 0.5 * base * height;
}

/* RECTANGLE AREA CALCUALTION */
export function rectangleArea(length, width) {
    return length * width;
}

/* SQUARE AREA CALCULATION */
export function squareArea(side) {
    return side * side;
}

/* Trapezoid AREA CALCULATION */
export function trapezoidArea(base1, base2, height) {
    
    return 0.5 * (base1 + base2) * height;
}

/* CALCULATE BASE AREA */
export function calculateBottomBaseArea(width, length) {
    const [finalWidth, finalLength] = width > length ? [length, width] : [width, length];
    return finalWidth === finalLength
        ? squareArea(finalWidth)
        : rectangleArea(finalLength, finalWidth);
}

/* FIND LEFT ANGLE TRIANGLE HYPOTENUSE */
export function findRoofVerticalHeight(base,opposite, angle) {
    return Math.sqrt(Math.pow(base, 2) + Math.pow(opposite, 2));
     
}


export function calculateTriangleLines(AB, BC, CA) {
    return calculateTotalLineLength(AB, CA);
}

// Reusable function to calculate height of an isosceles triangle
function calculateIsoscelesHeight(a, c) {
    const halfBase = c / 2;
    return Math.sqrt(a ** 2 - halfBase ** 2);
}

function calculateTotalLineLength(a, c, spacing = 2) {
    const height = calculateIsoscelesHeight(a, c);
    
    const verticalLines = Math.floor(c / spacing) + 1;
    const horizontalLines = Math.floor(height / spacing) + 1;

    let verticalLineLength = 0;
    for (let i = 0; i < verticalLines; i++) {
        verticalLineLength += height - (i * height / (verticalLines - 1));
    }

    let horizontalLineLength = 0;
    for (let i = 0; i < horizontalLines; i++) {
        horizontalLineLength += c - (i * c / (horizontalLines - 1));
    }

    return (verticalLineLength + horizontalLineLength).toFixed(2);
}

export function calculateTriangleScrews(base, height, spacing = 2) {
    let totalScrews = 0;
    let rows = Math.floor(height / spacing) + 1;

    for (let i = 0; i < rows; i++) {
        // Calculate the width at the current height level (assuming right triangle)
        let currentHeight = i * spacing;
        let currentWidth = (base / height) * currentHeight;
        let screwsInRow = Math.floor(currentWidth / spacing) + 1;
        
        totalScrews += screwsInRow;
    }

    return totalScrews;
}

/* RECTANGLE SCREW COUNT */
export function calculateRectangleScrews(length, width, spacing = 2) {
    let totalScrews = 0;
    let rows = Math.floor(width / spacing) + 1;
    let cols = Math.floor(length / spacing) + 1;

    totalScrews = rows * cols;

    return totalScrews;
}