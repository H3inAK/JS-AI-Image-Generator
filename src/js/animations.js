export const typeText = async (element, text) => {
  element.value = "";

  for (let i = 0; i < text.length; i++) {
    element.value += text.charAt(i);
    await new Promise((reslove) => setTimeout(reslove, 10));
  }
};
