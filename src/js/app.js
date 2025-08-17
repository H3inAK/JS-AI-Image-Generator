import initialRender from "./initialRender";
import listener from "./listeners";

class App {
  init() {
    initialRender();
    listener();
  }
}

export default App;
