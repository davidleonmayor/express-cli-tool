export type Architecture = "exagonal";

export type Database = "MySQL" | "PostgreSQL";

export type Testing = "Jest" | "Mocha";

export type ProjectDetails = {
  arquitecture: Architecture;
  importAlias: boolean;
  testing: Testing;
  database: Database;
};
