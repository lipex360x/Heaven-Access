import { getDatabase } from "@/server/database";
import { api, json } from "@/server/http";

export const dynamic = "force-dynamic";
export async function GET() {
  return api(async () => {
    const result = await getDatabase().query(
      `SELECT id, company_label AS "companyLabel", room_label AS "roomLabel", floor_label AS "floorLabel"
       FROM destinations ORDER BY id`,
    );
    return json({ destinations: result.rows });
  });
}
