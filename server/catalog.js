export function readCatalog(db) {
  const entities = db.prepare("SELECT * FROM entities ORDER BY name").all();
  const guides = db
    .prepare(
      "SELECT g.*, e.name AS entity_name, e.category AS entity_category, e.icon AS entity_icon, s.title AS source_title, s.url AS source_url, s.publisher AS source_publisher, s.checked_at AS source_checked_at, s.result AS source_result FROM guides g JOIN entities e ON e.id = g.entity_id LEFT JOIN sources s ON s.id = g.source_id ORDER BY e.name, g.title",
    )
    .all();
  const steps = db.prepare("SELECT * FROM steps ORDER BY position").all();
  const links = db.prepare("SELECT * FROM links ORDER BY purpose").all();
  const byGuide = new Map();
  for (const step of steps) {
    if (!byGuide.has(step.guide_id)) byGuide.set(step.guide_id, []);
    byGuide.get(step.guide_id).push(step);
  }
  const guideItems = guides.map((guide) => ({
    ...guide,
    aliases: JSON.parse(guide.aliases || "[]"),
    commonErrors: guide.common_errors ? JSON.parse(guide.common_errors) : [],
    source: guide.source_id
      ? {
          title: guide.source_title,
          url: guide.source_url,
          publisher: guide.source_publisher,
          checkedAt: guide.source_checked_at,
          result: guide.source_result,
        }
      : null,
    steps: byGuide.get(guide.id) || [],
  }));
  return { entities, guides: guideItems, links };
}
