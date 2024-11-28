// Default version (all methods)
import algoliasearch from "algoliasearch";

// Search-only version
// import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch("A026CQDNAH", process.env.ALGOLIA_SEARCH);
const index = client.initIndex("pets");

export { index };
