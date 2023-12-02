import { Brand, Category, Product } from "@prisma/client";

interface ISearchResult {
  products: Partial<Product>[];
  categories: Partial<Category>[];
  brands: Partial<Brand>[];
}

export default ISearchResult;
