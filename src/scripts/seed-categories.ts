import { db } from "@/db";
import { categories } from "@/db/schema";

// TODO: Create a script to seed categories
const categoryNames = [
	"Cars and Vehicles",
	"Comedy",
	"Education",
	"Gaming",
	"Entertainment",
	"Film and Animation",
	"How-to and Style",
	"Music",
	"News and Politics",
	"People and Blogs",
	"Pets and Animals",
	"Science and Technology",
	"Sports",
	"Travel and Events",
];

async function main() {
	console.log("Seeding categories...");

	try {
		const values = categoryNames.map((name) => ({
			name,
			description: `Videos on ${name}`,
		}));

		await db.insert(categories).values(values);

		console.log("Categories seeded ");
	} catch (error) {
		console.error("Error seeding categories: ", error);
		process.exit(1);
	}
}

main();
