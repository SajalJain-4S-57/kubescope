import { CostRow, DrillLevel } from "./types";

// Better hash — djb2 algorithm, more variance for similar strings
const hash = (str: string): number => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(h >>> 0);
};

const seedNumber = (seed: string, min: number, max: number): number => {
  const h = hash(seed);
  // Multiply by large prime before modulo to increase spread
  const spread = (h * 2654435761) >>> 0;
  return min + (spread % (max - min));
};

export const generateCostRow = (
  id: string,
  seedKey: string,
  name: string,
  level: DrillLevel
): CostRow => {
  const multiplier =
    level === "cluster" ? 1 : level === "namespace" ? 0.35 : 0.12;

  const cpu    = Math.round(seedNumber(seedKey + "||cpu",     500,  3000) * multiplier);
  const ram    = Math.round(seedNumber(seedKey + "||ram",     300,  1800) * multiplier);
  const storage= Math.round(seedNumber(seedKey + "||storage",  50,   400) * multiplier);
  const network= Math.round(seedNumber(seedKey + "||network",  80,   500) * multiplier);
  const gpu    = Math.round(seedNumber(seedKey + "||gpu",       0,  1000) * multiplier);

  // Efficiency: realistic spread 5–75%, never exceeds 75
  const efficiency = seedNumber(seedKey + "||eff", 5, 75);
  const total = cpu + ram + storage + network + gpu;

  return {
    id,
    name,
    cpu,
    ram,
    storage,
    network,
    gpu,
    efficiency,
    total,
  };
};

export const mapApiDataToCostRows = (
  titles: string[],
  level: DrillLevel,
  parentName: string = ""
): CostRow[] => {
  const levelLabel =
    level === "cluster"
      ? "Cluster"
      : level === "namespace"
      ? "Namespace"
      : "Pod";

  return titles.slice(0, 4).map((title, index) => {
    const displayName = `${levelLabel} ${String.fromCharCode(65 + index)}`;
    // seedKey uses API title + parent + index — guaranteed unique per row
    const seedKey = `${title}__${parentName}__${level}__${index}`;
    const id = `${parentName}-${displayName}-${index}`.replace(/\s+/g, "-");
    return generateCostRow(id, seedKey, displayName, level);
  });
};

export const findMostWasteful = (rows: CostRow[]): CostRow => {
  return rows.reduce((worst, current) =>
    current.efficiency < worst.efficiency ? current : worst
  );
};

export const calculateSavings = (row: CostRow): number => {
  const wasteRatio = (100 - row.efficiency) / 100;
  return Math.round(row.total * wasteRatio * 0.4);
};