// Legacy DOM manipulation
import { adressevaelger } from "./src/legacy.js";

// Web component
import { AdresseSearchInput } from "./src/web-component.js";

// Raw API class
import { AdresseSearchAPI } from "./src/api.js";

// Legacy DOM component must be exported as default
export default adressevaelger;

// Export the imports
export { adressevaelger, AdresseSearchInput, AdresseSearchAPI };
