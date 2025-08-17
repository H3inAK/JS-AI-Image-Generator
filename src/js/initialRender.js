import { themeToggleIcon } from "./selectors";

const getTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const windowPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const isDarkTheme =
    savedTheme === "dark" ||
    document.body.classList.contains("dark-theme") ||
    (!savedTheme && windowPrefersDark);
  document.body.classList.toggle("dark-theme", isDarkTheme);
  themeToggleIcon.className = isDarkTheme
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
};

const initialRender = () => {
  getTheme();
};

export default initialRender;
