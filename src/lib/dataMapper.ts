import { CostRow, DrillLevel } from "./types";

// Seeds a deterministic number from a string so same input = same output
const seedNumber = (str: string, min: number, max: number): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const normalized = Math.abs(hash) / 2147483647;
  return Math.floor(normalized * (max - min) + min);
};

// Generates a full CostRow from a name + level
export const generateCostRow = (
  id: string,
  name: string,
  level: DrillLevel
): CostRow => {
  const multiplier =
    level === "cluster" ? 1 : level === "namespace" ? 0.35 : 0.12;

  const cpu = seedNumber(name + "cpu", 800, 3000) * multiplier;
  const ram = seedNumber(name + "ram", 400, 1800) * multiplier;
  const storage = seedNumber(name + "storage", 80, 400) * multiplier;
  const network = seedNumber(name + "network", 100, 500) * multiplier;
  const gpu = seedNumber(name + "gpu", 0, 1000) * multiplier;
  const efficiency = seedNumber(name + "eff", 5, 75);
  const total = cpu + ram + storage + network + gpu;

  return {
    id,
    name,
    cpu: Math.round(cpu),
    ram: Math.round(ram),
    storage: Math.round(storage),
    network: Math.round(network),
    gpu: Math.round(gpu),
    efficiency,
    total: Math.round(total),
  };
};

// Maps raw API titles into CostRows for a given drill level
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
    const name = `${levelLabel} ${String.fromCharCode(65 + index)}`;
    const id = `${parentName}-${name}-${index}`.replace(/\s+/g, "-");
    return generateCostRow(id, name, level);
  });
};

// Returns the most wasteful row (lowest efficiency, highest cost)
export const findMostWasteful = (rows: CostRow[]): CostRow => {
  return rows.reduce((worst, current) =>
    current.efficiency < worst.efficiency ? current : worst
  );
};

// Returns potential savings estimate
export const calculateSavings = (row: CostRow): number => {
  const wasteRatio = (100 - row.efficiency) / 100;
  return Math.round(row.total * wasteRatio * 0.4);
};