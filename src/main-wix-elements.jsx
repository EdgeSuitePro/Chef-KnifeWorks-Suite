// src/main-wix-elements.jsx
import React from "react";
import { createRoot } from "react-dom/client";

// Import your Greta components here:
import ReservationPage from "./pages/ReservationPage";
import Dashboard from "./pages/Dashboard";
import CRMPage from "./pages/CRMpage";
import PickupPage from "./pages/PickupPage";

// A utility to wrap a React component as a Web Component
function registerElement(tagName, Component) {
  class ReactWebComponent extends HTMLElement {
    connectedCallback() {
      if (this._mounted) return;
      const mountPoint = document.createElement("div");
      this.appendChild(mountPoint);
      this._root = createRoot(mountPoint);
      this._root.render(<Component />);
      this._mounted = true;
    }

    disconnectedCallback() {
      if (this._root) {
        this._root.unmount();
        this._root = null;
        this._mounted = false;
      }
    }
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, ReactWebComponent);
  }
}

// Register each Greta UI module you want inside Wix Studio:
registerElement("ckw-reservation", ReservationPage);
registerElement("ckw-dashboard", Dashboard);
registerElement("ckw-crm", CRMPage);
registerElement("ckw-pickup", PickupPage);

