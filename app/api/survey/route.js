import { supabase } from "@/lib/supabase";

const VALID_SCENTS = ["Summer Rain", "Shishanyama", "Your mom is cooking briyani"];

export async function POST(req) {
  try {
    const body = await req.json();
    const { full_name, age, favorite_scent } = body;

    if (!full_name || typeof full_name !== "string" || full_name.trim().length === 0)
      return Response.json({ error: "Full name is required." }, { status: 400 });

    if (full_name.trim().length > 100)
      return Response.json({ error: "Full name is too long." }, { status: 400 });

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120)
      return Response.json({ error: "Please enter a valid age." }, { status: 400 });

    if (!VALID_SCENTS.includes(favorite_scent))
      return Response.json({ error: "Please select a valid scent." }, { status: 400 });

    const { data, error } = await supabase
      .from("participants")
      .insert([{ full_name: full_name.trim(), age: ageNum, favorite_scent }])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json({ error: "Failed to save response. Please try again." }, { status: 500 });
    }

    return Response.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Survey API error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error)
      return Response.json({ error: "Failed to fetch results." }, { status: 500 });

    const tally = VALID_SCENTS.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    data.forEach((r) => { if (tally[r.favorite_scent] !== undefined) tally[r.favorite_scent]++; });

    return Response.json({ total: data.length, tally, responses: data });
  } catch (err) {
    console.error("Survey GET error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
