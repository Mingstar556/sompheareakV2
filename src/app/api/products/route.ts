import { NextResponse } from "next/server";
import { getProducts, addProduct, resetProducts } from "@/lib/db";

export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json({ success: true, data: products, count: products.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "reset") {
      const reset = resetProducts();
      return NextResponse.json({ success: true, message: "Catalog reset to defaults", data: reset });
    }

    if (!body.name) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    const created = addProduct({
      name: body.name,
      nameKh: body.nameKh || body.name,
      cat: body.cat || "minifigure",
      price: Number(body.price) || 5.0,
      discount: Number(body.discount) || 0,
      stock: Number(body.stock) || 10,
      pt: Number(body.pt) || 4,
      image: body.image || "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80",
      bio: body.bio || "Fun toy collectible.",
      bioKh: body.bioKh || "ប្រដាប់ក្មេងលេងគុណភាពខ្ពស់។",
      rarity: body.rarity || "Rare",
      rating: 5.0,
      reviewsCount: 1,
      featured: true,
      isNew: true,
      free_delivery: true,
      ageRecommendation: body.ageRecommendation || "Ages 4+",
      dimensions: body.dimensions || "10cm x 8cm",
    });

    return NextResponse.json({ success: true, message: "Product created successfully", data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
