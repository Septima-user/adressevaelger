/**
 * options.endpoint options.token
 */
export class AdresseSearchAPI {
  apiUrl = "https://adressevaelger.dk";
  token = "";

  constructor(options) {
    if (!options || !options.token) {
      throw new Error(
        'AdresseSearchAPI must be initialized with a valid configuration. `{token: "xxx"} is the minimum required.`',
      );
    }
    this.token = options.token;
    // Configure custom API URL
    if (options.apiUrl) {
      this.apiUrl = options.apiUrl;
    }
  }

  async search(endpoint, query, options = {}) {
    if (!endpoint || !query) {
      throw new Error("search() requires both endpoint and query parameters.");
    }
    const response = await fetch(
      `${this.apiUrl}/${endpoint}/soeg?tekst=${query}&token=${this.token}${this.formatParams(options)}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status === "fejl") {
      throw new Error(`Search error: ${data.beskrivelse}`);
    }
    return data.fund;
  }

  async get(endpoint, id) {
    if (!endpoint || !id) {
      throw new Error("get() requires both endpoint and id parameters.");
    }
    const response = await fetch(
      `${this.apiUrl}/${endpoint}/${id}?token=${this.token}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status === "fejl") {
      throw new Error(data.beskrivelse);
    }
    return data;
  }

  formatParams(options) {
    let queryStr = "";
    if (options.medtagForeloebige) {
      queryStr += `&medtagForeloebige=true`;
    }
    if (options.maksimum) {
      queryStr += `&maksimum=${options.maksimum}`;
    }
    if (options.kommuneKode) {
      queryStr += `&kommuneKode=${options.kommuneKode}`;
    }
    if (options.vejnavn) {
      queryStr += `&vejnavn=${options.vejnavn}`;
    }
    if (options.postnummer) {
      queryStr += `&postnummer=${options.postnummer}`;
    }
    return queryStr;
  }
}
