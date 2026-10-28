import catalog from "./catalog-data.json" with { type: "json" };

export default function handler(_request, response) {
  response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  response.setHeader("X-Content-Type-Options", "nosniff");
  return response.status(200).json(catalog);
}
