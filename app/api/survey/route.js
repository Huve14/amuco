import { supabase } from "@/lib/supabase";
import { LOCATIONS } from "@/lib/locations";

const VALID_SCENTS = ["Summer Rain", "Shisanyama", "Amagwinya"];

export async function POST(req) {
  try {
    const body = await req.json();
    const { full_name, age, email, contact_number, favorite_scent, location } = body;

    if (!full_name || typeof full_name !== "string" || full_name.trim().length === 0)
      return Response.json({ error: "Full name is required." }, { status: 400 });

    if (full_name.trim().length > 100)
      return Response.json({ error: "Full name is too long." }, { status: 400 });

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120)
      return Response.json({ error: "Please enter a valid age." }, { status: 400 });

    const emailVal = email?.trim() || null;
    const contactVal = contact_number?.trim() || null;
    if (!emailVal && !contactVal)
      return Response.json({ error: "Please provide an email address or contact number." }, { status: 400 });

    if (!VALID_SCENTS.includes(favorite_scent))
      return Response.json({ error: "Please select a valid scent." }, { status: 400 });

    const validatedLocation = location && LOCATIONS[location] ? location : null;

    const { data, error } = await supabase
      .from("participants")
      .insert([{ full_name: full_name.trim(), age: ageNum, email: emailVal, contact_number: contactVal, favorite_scent, location: validatedLocation }])
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
      .select("favorite_scent, created_at")
      .order("created_at", { ascending: false });

    if (error)
      return Response.json({ error: "Failed to fetch results." }, { status: 500 });

    const tally = VALID_SCENTS.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    data.forEach((r) => { if (tally[r.favorite_scent] !== undefined) tally[r.favorite_scent]++; });

    return Response.json({ total: data.length, tally });
  } catch (err) {
    console.error("Survey GET error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
