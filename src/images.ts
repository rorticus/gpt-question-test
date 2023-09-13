interface ImageResults {
  image: string;
  title: string;
}

export async function searchImages(query: string): Promise<ImageResults[]> {
  const response = await fetch(
    `https://api.serpdog.io/images?api_key=${
      import.meta.env.VITE_GOOGLE_KEY
    }&q=${encodeURIComponent(query)}&safe=active`,
  );

  const json = await response.json();

  return json.image_results.map((m: any) => ({
    image: m.image,
    title: m.title,
  }));
}
