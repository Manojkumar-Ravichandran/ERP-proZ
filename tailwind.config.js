/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,jsx}"],
  theme: {
    fontFamily: {
      display: ["Inter", "sans-serif"],
    },
    colors: {
      primary: {
        40: "#cfe9f7",
        50: "#87c8ec",
        100: "#6ebce8",
        200: "#56b1e4",
        300: "#3ea6e1",
        400: "#269bdd",
        500: "#0e90d9",
        600: "#0d82c3",
        700: "#0b73ae",
        800: "#0a6598",
        900: "#085682",
        950: "#07486d",
      },
      secondary: {
        40: "#d5d6d8",
        50: "#aaadb1",
        100: "#95999d",
        200: "#6b7076",
        300: "#555b62",
        400: "#40474f",
        500: "#2b323b",
        600: "#5a6673",
        700: "#434d56",
        800: "#2d333a",
      },
      black: {
        50: "#f7f7f7", // Very light gray, almost white
        100: "#efefef", // Very light gray
        200: "#dcdcdc", // Light gray
        300: "#b8b8b8", // Medium-light gray
        400: "#949494", // Mid-tone gray
        500: "#707070", // Medium gray
        600: "#4c4c4c", // Darker gray
        700: "#383838", // Dark gray
        800: "#242424", // Very dark gray
        900: "#121212", // Near black
        950: "#0a0a0a", // Very close to pure black
      },
      yellow: {
        40: "#fff9db",
        50: "#fff3c4",
        100: "#ffe69a",
        200: "#ffd970",
        300: "#ffcc47",
        400: "#ffbf1e",
        500: "#ffb200",
        550: "#F9FCC8",
        600: "#e6a000",
        700: "#cc8e00",
        800: "#b37c00",
        900: "#996a00",
        950: "#805800",
      },
      red: {
        40: "#ffe5e5",
        50: "#ffcccc",
        100: "#ff9999",
        200: "#ff6666",
        300: "#ff3333",
        400: "#ff1a1a",
        500: "#ff0000",
        600: "#e60000",
        700: "#cc0000",
        800: "#b30000",
        900: "#990000",
        950: "#800000",
      },
      green: {
        40: "#e6f9e6",
        50: "#ccf2cc",
        100: "#99e699",
        200: "#66d966",
        300: "#33cc33",
        400: "#1ab31a",
        500: "#00b300",
        600: "#00a000",
        700: "#008d00",
        800: "#007a00",
        900: "#006600",
        950: "#005200",
      },

      white: {
        50: "#ffffff", // Pure white
        100: "#fefefe", // Slightly off-white
        200: "#fcfcfc", // Very light white-gray
        300: "#fafafa", // Light white-gray
        400: "#f5f5f5", // Pale white-gray
        500: "#f0f0f0", // Soft grayish white
        600: "#eaeaea", // Subtle white-gray
        700: "#e0e0e0", // Neutral light gray
        800: "#d6d6d6", // Neutral mid-gray
        900: "#cccccc", // Soft light gray
      },

      blue: {
        50: "#e5f0ff", // Pale sky blue
        100: "#cce0ff", // Light blue
        200: "#99c2ff", // Soft blue
        300: "#66a3ff", // Bright blue
        400: "#3385ff", // Vivid blue
        500: "#0066ff", // Pure blue
        600: "#0052cc", // Darker blue
        700: "#003d99", // Deep blue
        800: "#002966", // Navy blue
        900: "#001433", // Almost black blue
      },

      purples: {
        50: "#f5e5ff", // Pale lavender
        100: "#ebccff", // Light purple
        200: "#d999ff", // Soft purple
        300: "#c666ff", // Bright purple
        400: "#b333ff", // Vivid purple
        500: "#a000ff", // Pure purple
        600: "#8000cc", // Darker purple
        700: "#600099", // Deep purple
        800: "#400066", // Very dark purple
        900: "#200033", // Almost black purple
      },
      gray: {
        50: "#f9f9f9", // Almost white gray
        100: "#f2f2f2", // Very light gray
        200: "#e0e0e0", // Light gray
        300: "#cccccc", // Neutral gray
        400: "#b3b3b3", // Medium gray
        500: "#999999", // Mid-tone gray
        600: "#808080", // Darker gray
        700: "#666666", // Deep gray
        800: "#4d4d4d", // Very dark gray
        900: "#333333", // Near black gray
      },
      pink: {
        50: "#ffe5f0", // Pale pink
        100: "#ffccd9", // Light pink
        200: "#ff99b3", // Soft pink
        300: "#ff668c", // Medium pink
        400: "#ff3366", // Bright pink
        500: "#ff0040", // Vivid pink
        600: "#cc0033", // Dark pink
        700: "#990026", // Deep pink
        800: "#66001a", // Very dark pink
        900: "#33000d", // Almost black pink
        950: "#1a0007", // Extremely dark pink, nearly black
      },
      orange: {
        50: "#fff4e5", // Pale orange, almost cream
        100: "#ffe8cc", // Light orange
        200: "#ffd199", // Soft orange
        300: "#ffba66", // Warm orange
        400: "#ffa333", // Bright orange
        500: "#ff8c00", // Pure orange
        600: "#cc7000", // Darker orange
        700: "#995400", // Deep orange
        800: "#663800", // Very dark orange
        900: "#331c00", // Almost black orange
        950: "#1a0e00", // Extremely dark orange, nearly black
      },
      brown: {
        50: "#f5ece5", // Pale beige, almost cream
        100: "#ebd9cc", // Light beige-brown
        200: "#d6b399", // Soft tan-brown
        300: "#c28c66", // Warm light brown
        400: "#ad6640", // Mid-tone brown
        500: "#994d26", // True brown
        600: "#7a3e1f", // Darker brown
        700: "#5c2f19", // Deep brown
        800: "#3d1f12", // Very dark brown
        900: "#1f1009", // Almost black brown
        950: "#100804", // Extremely dark brown, nearly black
      },
      teal: {
        50: "#e5f7f7", // Pale teal, almost white
        100: "#cceded", // Light teal
        200: "#99dbdb", // Soft teal
        300: "#66c9c9", // Medium teal
        400: "#33b6b6", // Bright teal
        500: "#00a3a3", // True teal
        600: "#008383", // Darker teal
        700: "#006363", // Deep teal
        800: "#004242", // Very dark teal
        900: "#002121", // Almost black teal
        950: "#001010", // Extremely dark teal, nearly black
      },
      peach: {
        50: "#fff5f0", // Pale peach, almost white
        100: "#ffe8e0", // Light peach
        200: "#ffd0c1", // Soft peach
        300: "#ffb8a3", // Warm peach
        400: "#ffa085", // Bright peach
        500: "#ff8866", // True peach
        600: "#cc6c52", // Darker peach
        700: "#99503d", // Deep peach
        800: "#663429", // Very dark peach
        900: "#331a14", // Almost black peach
        950: "#1a0d0a", // Extremely dark peach, nearly black
      },
      gold: {
        50: "#fffbea", // Pale gold, almost cream
        100: "#fff3c2", // Light gold
        200: "#ffe68b", // Soft gold
        300: "#ffd954", // Warm gold
        400: "#ffcc1d", // Bright gold
        500: "#f0b800", // True gold
        600: "#c09500", // Darker gold
        700: "#907200", // Deep gold
        800: "#604e00", // Very dark gold
        900: "#302700", // Almost black gold
        950: "#181300", // Extremely dark gold, nearly black
      },
      magenta: {
        50: "#ffe5f7", // Pale magenta, almost pink
        100: "#ffcced", // Light magenta
        200: "#ff99db", // Soft magenta
        300: "#ff66c9", // Medium magenta
        400: "#ff33b6", // Bright magenta
        500: "#ff00a3", // True magenta
        600: "#cc0083", // Darker magenta
        700: "#990063", // Deep magenta
        800: "#660042", // Very dark magenta
        900: "#330021", // Almost black magenta
        950: "#1a0010", // Extremely dark magenta, nearly black
      },
    },
    extend: {
      width:{
        15:'3.75rem'
      },
      height:{
        15:'3.75rem'
      }
    },
  },
  plugins: [],
};