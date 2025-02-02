import { getEventData } from "@/app/actions";

export async function GET(request: Request) {
  try {
        const result = await getEventData();
        if (result == null) throw new Error('No Data');
        
        return Response.json(result);
    } catch (err) {
        return Response.json({ error: "No Data" }, {
            status: 500,
        });
    }   
}
