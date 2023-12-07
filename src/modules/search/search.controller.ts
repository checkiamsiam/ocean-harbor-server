import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { IQueryFeatures } from "../../interfaces/queryFeatures.interface";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import sendResponse from "../../utils/sendResponse.util";
import brandService from "../brand/brand.service";
import categoryService from "../category/category.service";
import productService from "../product/product.service";
import ISearchResult from "./search.interface";

const globalSearch: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const queryFeatureCopy: IQueryFeatures = {
      limit: req.queryFeatures.limit || undefined,
      page: req.queryFeatures.page,
      skip: req.queryFeatures.skip || undefined,
      searchKey: req.queryFeatures.searchKey,
      fields: {},
      filters: {},
      populate: {},
      sort: req.queryFeatures.sort,
    };

    const products = await productService.getProducts(queryFeatureCopy);

    const categories = await categoryService.getCategories(queryFeatureCopy);

    const brands = await brandService.getBrands(queryFeatureCopy);

    sendResponse<ISearchResult>(res, {
      statusCode: httpStatus.OK,
      success: true,
      meta: {
        total: products.total,
        limit: queryFeatureCopy.limit,
        page: queryFeatureCopy.page,
      },
      data: {
        products: products.data,
        categories: categories.data,
        brands: brands.data,
      },
    });
  }
);

const searchController = {
  globalSearch,
};
export default searchController;
