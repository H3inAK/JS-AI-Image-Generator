import { typeText } from "./animations";
import examplePrompts from "./examplePrompts";
import { createImageCards } from "./generateImages";
import {
  galleryGrid,
  imgCardTemplate,
  promptFrom,
  promptInput,
  themeToggleIcon,
} from "./selectors";

export const themeToggleHandler = () => {
  const isDarkTheme = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  themeToggleIcon.className = isDarkTheme
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
};

export const promptBtnHandler = () => {
  const prompt =
    examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  typeText(promptInput, prompt);
  promptInput.focus();
};

export const promptFormHandler = (e) => {
  e.preventDefault();
  const promptFormData = new FormData(promptFrom);
  const promptText = promptInput.value.trim();
  const selectedModel = promptFormData.get("model-select");
  const selectedImageCount = promptFormData.get("image-count-select") || 1;
  const selectedaspectRatio =
    promptFormData.get("aspect-ratio-select") || "1/1";

  createImageCards(
    promptText,
    selectedModel,
    selectedImageCount,
    selectedaspectRatio
  );
};
