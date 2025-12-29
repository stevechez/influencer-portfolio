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

export async function getPortfolioImages() {
	try {
		const results = await cloudinary.search
			.expression('folder:portfolio/*')
			.sort_by('created_at', 'desc')
			.with_field('tags') // <--- IMPORTANT: Fetch tags for filtering later
			.max_results(30)
			.execute();

		// Process images in parallel
		const resources = results.resources;

		// We map over resources and wait for all base64 generations to finish
		const shots = await Promise.all(
			resources.map(async (resource: any) => {
				const blurDataURL = await getBase64ImageUrl(resource.public_id);

				return {
					id: resource.asset_id,
					url: cloudinary.url(resource.public_id, {
						fetch_format: 'auto',
						quality: 'auto',

						// 1. Use 'thumb' or 'fill' to allow zooming
						crop: 'fill',
						// 2. Focus on the face so the crop doesn't cut off heads
						gravity: 'face',
						// 3. Zoom in 10% (1.1). This pushes the bottom-right watermark out of view.
						zoom: '1.1',
						// Optional: Ensure the aspect ratio stays consistent if you want
						// aspect_ratio: "4:5"
						effect: 'gen_remove:prompt_text_logo',
					}),
					width: resource.width,
					height: resource.height,
					scenario: resource.context?.custom?.caption || resource.filename,
					tags: resource.tags || [], // <--- Pass tags to frontend
					blurDataURL,
					// <--- The magic string
				};
			})
		);

		return shots;
	} catch (error) {
		console.error('Cloudinary Fetch Error:', error);
		return [];
	}
}
