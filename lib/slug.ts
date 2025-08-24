// lib/slug.ts
import slugify from "slugify";


export function toSlug(input: string) {
return slugify(input, { lower: true, strict: true, locale: "id" });
}