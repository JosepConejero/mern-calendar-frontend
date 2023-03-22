import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { store } from "./store";

export const CalendarApp = () => {
  return (
    <Provider store={store}>
      {/* <BrowserRouter> */}
      <HashRouter>
        <AppRouter />
      </HashRouter>
      {/* </BrowserRouter> */}
    </Provider>
  );
};
