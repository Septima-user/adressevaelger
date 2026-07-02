import { AdresseSearchAPI } from "./api.js";

export function adressevaelger(element, options) {
  const adressevaelgerui = new AdresseSearchUI(element, options);
}

export class AdresseSearchUI {
  searchType = "adresser";
  debounceTimer;
  options;
  wrapperElement;
  inputElement;
  listElement;
  api;

  constructor(element, options) {
    this.options = options;
    this.searchType = options.adgangsadresserOnly ? "husnumre" : "adresser";
    this.inputElement = element;
    this.listElement = document.createElement("div");
    this.wrapperElement = this.inputElement.parentNode;
    this.wrapperElement.append(this.listElement);
    this.inputElement.addEventListener("input", this.inputHandler.bind(this));
    this.wrapperElement.addEventListener(
      "keyup",
      this.listKeyHandler.bind(this),
    );
    document.addEventListener("click", this.outsideClickHandler.bind(this));
    const opt = this.options.apiUrl
      ? { token: options.token, apiUrl: this.options.apiUrl }
      : { token: options.token };
    this.api = new AdresseSearchAPI(opt);
  }

  inputHandler(event) {
    if (event.target.value === "") {
      this.renderDOMList(this.listElement, []);
      return;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(async () => {
      await this.refreshList(event.target.value);
    }, 500);
  }

  async refreshList(queryText) {
    try {
      const data = await this.api.search(
        this.searchType,
        queryText,
        this.options,
      );
      this.renderDOMList(this.listElement, data);
    } catch (err) {
      this.errorHandler(
        new Error(`Failed to load search items: ${err.message}`),
      );
    }
  }

  renderDOMList(parentElement, items) {
    const ulEl = document.createElement("ul");
    ulEl.className = "adressevaelger-suggestions";
    ulEl.role = "listbox";
    ulEl.ariaLabel = "Søgeresultater";
    items.forEach((item) => {
      this.renderDOMListItem(ulEl, item);
    });
    parentElement.querySelector("ul")?.remove();
    parentElement.append(ulEl);
  }

  renderDOMListItem(parentElement, item) {
    const liEl = document.createElement("li");
    liEl.className = "adressevaelger-suggestion";
    liEl.role = "option";
    liEl.tabIndex = 0;
    liEl.dataset.item = JSON.stringify(item);
    liEl.addEventListener("click", (event) => {
      this.selectProcessor(JSON.parse(event.target.dataset.item));
    });
    liEl.innerText = item.titel;
    parentElement.append(liEl);
  }

  errorHandler(err) {
    this.inputElement.dispatchEvent(
      new CustomEvent("address:error", {
        bubbles: true,
        composed: true,
        detail: { message: err.message },
      }),
    );
  }

  listKeyHandler(event) {
    if (event.key === "ArrowDown") {
      this.moveFocus(1);
    } else if (event.key === "ArrowUp") {
      this.moveFocus(-1);
    } else if (
      event.key === "Enter" &&
      this.listElement.querySelector(":focus")
    ) {
      this.inputElement.focus();
      this.selectProcessor(JSON.parse(event.target.dataset.item));
    } else if (event.key === "Escape") {
      this.inputElement.focus();
      this.listElement.querySelector("ul")?.remove();
    }
  }

  outsideClickHandler(event) {
    if (!this.wrapperElement.contains(event.target)) {
      this.listElement.querySelector("ul")?.remove();
    }
  }

  moveFocus(direction) {
    if (!this.listElement.querySelector("ul")) {
      return;
    }
    const next = this.listElement.querySelector(":focus")?.nextElementSibling;
    const previous =
      this.listElement.querySelector(":focus")?.previousElementSibling;
    const first = this.listElement.querySelector("li");
    this.listElement.querySelectorAll("li").forEach((li) => {
      li.classList.remove("dawa-selected");
    });
    if (direction === 1 && !next && !previous) {
      first.focus();
    } else if (direction === -1 && !previous) {
      this.inputElement.focus();
    } else if (direction === 1 && next) {
      next.focus();
    } else if (direction === -1 && previous) {
      previous.focus();
    }
    this.listElement.querySelector(":focus")?.classList.add("dawa-selected");
  }

  selectProcessor(item) {
    if (
      item.type === "vejnavn" ||
      item.type === "navngivenvejpostnummer" ||
      (item.type === "husnummer" && this.searchType === "adresser")
    ) {
      this.inputElement.value = item.titel;
      this.refreshList(item.titel);
    } else {
      this.listElement.querySelector("ul")?.remove();
      this.selectItem(item);
    }
  }

  async selectItem(item) {
    try {
      const data = await this.api.get(this.searchType, item.id);
      this.inputElement.value = item.titel;
      this.inputElement.dispatchEvent(
        new CustomEvent("address:select", {
          bubbles: true,
          composed: true,
          detail: data,
        }),
      );
      this.options.select(data);
    } catch (err) {
      this.errorHandler(new Error(`Failed to fetch items: ${err.message}`));
    }
  }
}
