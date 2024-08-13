import slugify from "slugify";
import xss from "xss";
import { supabase } from "./initSupabase";

export async function getMeals() {
  const { data, error } = await supabase.from("meals").select("*");

  if (error) {
    throw error;
  }

  return data;
}

export async function getMeal(slug) {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const bufferedImage = await meal.image.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("meals")
    .upload(fileName, bufferedImage);

  if (uploadError) {
    console.log("erro upload");
    throw uploadError;
  }

  meal.image = fileName;

  const { error } = await supabase.from("meals").insert([
    {
      title: meal.title,
      summary: meal.summary,
      instructions: meal.instructions,
      creator: meal.creator,
      creator_email: meal.creator_email,
      image: meal.image,
      slug: meal.slug,
    },
  ]);

  if (error) {
    throw error;
  }
}
