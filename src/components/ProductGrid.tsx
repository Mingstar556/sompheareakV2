"use client";

import React, { useMemo } from "react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "./ProductCard";
import { CategoryArcade } from "./CategoryArcade";
import { Search, ArrowUpDown, Sparkles, X } from "lucide-react";
import { sounds } from "@/utils/audio";

export const ProductGrid: React.FC = () => {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, sortBy, setSortBy, language, t } =
    useStore();

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  const filteredAndSortedProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === "all" || p.cat === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.nameKh.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => {
        const pa = a.price * (1 - a.discount / 100);
        const pb = b.price * (1 - b.discount / 100);
        return pa - pb;
      });
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => {
        const pa = a.price * (1 - a.discount / 100);
        const pb = b.price * (1 - b.discount / 100);
        return pb - pa;
      });
    } else if (sortBy === "points") {
      list = [...list].sort((a, b) => b.pt - a.pt);
    } else if (sortBy === "rating") {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section id="toy-catalog" className="py-12 px-4 max-w-7xl mx-auto">
      {/* Category Arcade Tabs */}
      <CategoryArcade />

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-toy-purple text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                sounds.playPop();
                setSearchQuery("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-toy-yellow" />
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{t("sortBy")}:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              sounds.playPop();
              setSortBy(e.target.value);
            }}
            className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 outline-none focus:border-toy-yellow cursor-pointer"
          >
            <option value="featured">{t("sortFeatured")}</option>
            <option value="price-asc">{t("sortPriceAsc")}</option>
            <option value="price-desc">{t("sortPriceDesc")}</option>
            <option value="points">{t("sortPoints")}</option>
            <option value="rating">{t("sortRating")}</option>
          </select>
        </div>
      </div>

      {/* Section Title & Count */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="text-2xl font-black text-white font-fredoka flex items-center gap-2">
            <span>{currentCategoryObj.icon}</span>
            <span>
              {selectedCategory === "all"
                ? t("allToys")
                : language === "km"
                ? currentCategoryObj.kh
                : currentCategoryObj.name}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{currentCategoryObj.description}</p>
        </div>

        <span className="text-xs font-bold text-toy-cyan bg-toy-cyan/10 px-3 py-1 rounded-full border border-toy-cyan/30">
          {filteredAndSortedProducts.length} items
        </span>
      </div>

      {/* Grid of Products */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-black text-white font-fredoka mt-3">No toys found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keyword or clearing the filters to explore all drops!
          </p>
          <button
            onClick={() => {
              sounds.playPop();
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-toy-purple text-white text-xs font-bold shadow-md hover:opacity-90"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
