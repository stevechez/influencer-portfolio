import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

// Helper: Download a tiny version of the image and convert to Base64
async function getBase64ImageUrl(imageId: string): Promise<string | undefined> {
	try {
		const imageUrl = cloudinary.url(imageId, {
			width: 100, // Tiny width
			blur: 1000, // Maximum blur
			quality: 'auto',
			format: 'webp',
		});

		const response = await fetch(imageUrl);
		const buffer = await response.arrayBuffer();
		const base64 = Buffer.from(buffer).toString('base64');
		return `data:image/webp;base64,${base64}`;
	} catch (e) {
		return undefined;
	}
}

// ... existing getPortfolioImages function ...

export async function getImageById(id: string) {
  try {
    const results = await cloudinary.search
      .expression(`asset_id:${id}`)
      .max_results(1)
      .execute();

    if (!results.resources || results.resources.length === 0) {
      return null;
    }

    const resource = results.resources[0];

    // Reuse your mapping logic here
    return {
      id: resource.asset_id,
      url: cloudinary.url(resource.public_id, {
        fetch_format: 'auto',
        quality: 'auto',
      }),
      width: resource.width,
      height: resource.height,
      scenario: resource.context?.custom?.caption || resource.filename,
      tags: resource.tags || [],
    };
  } catch (error) {
    console.error("Cloudinary Single Fetch Error:", error);
    return null;
  }
}

export async function getPortfolioImages(tag?: string) { // <--- Added argument here
  try {
    // Force lowercase to avoid case-sensitivity issues
    const safeTag = tag ? tag.toLowerCase() : undefined;

    // If a tag is provided, filter by it. Otherwise, show everything.
    const expression = safeTag 
      ? `folder:portfolio/* AND tags:${safeTag}` 
      : `folder:portfolio/*`;

    const results = await cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .with_field('tags')
      .max_results(30)
      .execute();

    // ... (Keep your existing mapping logic below unchanged) ...
    const resources = results.resources;
    
    // ... rest of the file ...
    const shots = await Promise.all(resources.map(async (resource: any) => {
        // ... (your existing base64 and mapping code)
        // You likely don't need to change the mapping code, just the top part of this function.
        // But make sure you return 'shots' at the end.
        return {
             id: resource.asset_id,
             url: cloudinary.url(resource.public_id, {
                 fetch_format: 'auto',
                 quality: 'auto',
             }),
             width: resource.width,
             height: resource.height,
             scenario: resource.context?.custom?.caption || resource.filename,
             tags: resource.tags || [],
             // ensure blurDataURL logic is here if you had it
        };
    }));

    return shots;

  } catch (error) {
    console.error("Cloudinary Fetch Error:", error);
    return [];
  }
}

