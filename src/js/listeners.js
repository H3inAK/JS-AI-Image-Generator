import {
  promptBtnHandler,
  promptFormHandler,
  themeToggleHandler,
} from "./handlers";
import { promptBtn, promptFrom, themeToggle } from "./selectors";

const listener = () => {
  themeToggle.addEventListener("click", themeToggleHandler);
  promptBtn.addEventListener("click", promptBtnHandler);
  promptFrom.addEventListener("submit", promptFormHandler);
};

export default listener;
