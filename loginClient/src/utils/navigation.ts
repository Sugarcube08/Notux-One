import type { NavigateFunction, NavigateOptions, To } from "react-router-dom";

let navigatorRef: NavigateFunction | null = null;

export const setNavigator = (navigator: NavigateFunction) => {
  navigatorRef = navigator;
};

export const navigateTo = (to: To | number, options?: NavigateOptions) => {
  if (!navigatorRef) {
    console.warn("Navigator not set yet; navigation request ignored for", to);
    return;
  }

  if (typeof to === "number") {
    navigatorRef(to);
  } else {
    navigatorRef(to, options);
  }
};
