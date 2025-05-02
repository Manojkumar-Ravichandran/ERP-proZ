// Caesar cipher encryption function
// Caesar cipher encryption function
export  function caesarEncrypt(text, shift = 5) {
  // Define the character set including all printable characters
  const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 {}[]()!"#$%&\'()*+,-./:;<=>?@^_`|~';
  const totalChars = allChars.length;
  let result = '';

  for (let i = 0; i < text.length; i++) {
      let char = text[i];
      let index = allChars.indexOf(char);

      if (index === -1) {
          // Character not in allChars set, keep it unchanged
          result += char;
      } else {
          let newIndex = (index + shift) % totalChars;
          result += allChars[newIndex];
      }
  }

  return result;
}

// Caesar cipher decryption function
export function caesarDecrypt(text, shift = 5) {
  const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 {}[]()!"#$%&\'()*+,-./:;<=>?@^_`|~';
  const totalChars = allChars.length;
  let result = '';

  for (let i = 0; i < text.length; i++) {
      let char = text[i];
      let index = allChars.indexOf(char);

      if (index === -1) {
          // Character not in allChars set, keep it unchanged
          result += char;
      } else {
          let newIndex = (index - shift + totalChars) % totalChars;  // Ensure non-negative index
          result += allChars[newIndex];
      }
  }

  return result;
}

export function splitFirstAndLastLetter(obj) {
  const str = JSON.stringify(obj);
  if (str.length <= 2) {
    return "";
  }

  return str.slice(1, -1);
}
