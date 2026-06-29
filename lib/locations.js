export const LOCATIONS = {
  "mall-of-africa": {
    name: "Mall of Africa",
    area: "Movies Area",
    launch: "2026-05-30",
  },
  "mall-of-the-north": {
    name: "Mall of the North",
    area: "Pick n Pay Area",
    launch: "2026-05-09",
  },
  gateway: {
    name: "Gateway Mall",
    area: "Checkers Area",
    launch: "2026-06-06",
  },
  "canal-walk": {
    name: "Canal Walk",
    area: "Pick n Pay Area",
    launch: "2026-06-27",
  },
};

export function resolveLocation(slug) {
  return LOCATIONS[slug] ?? null;
}

export function isLaunched(slug) {
  const loc = LOCATIONS[slug];
  if (!loc) return false;
  return new Date(loc.launch) <= new Date();
}
