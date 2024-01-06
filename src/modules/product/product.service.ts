import { Prisma, Product } from "@prisma/client";
import httpStatus from "http-status";
import prismaHelper from "../../helpers/prisma.helper";
import {
  IQueryFeatures,
  IQueryResult,
} from "../../interfaces/queryFeatures.interface";
import prisma from "../../shared/prismaClient";
import { asyncForEach } from "../../utils/asyncForEach.util";
import AppError from "../../utils/customError.util";
import { generateNewID } from "../../utils/generateId.util";

const create = async (payload: Product): Promise<Product> => {
  const result = await prisma.$transaction(async (txc) => {
    const subCategoryExist = await txc.category.findUnique({
      where: {
        id: payload.categoryId,
      },
      include: {
        subCategories: true,
      },
    });

    const isCatSubOk = subCategoryExist?.subCategories.find(
      (subCat) => subCat.id === payload.subCategoryId
    );

    if (!isCatSubOk) {
      throw new AppError(
        "Sub Category Is not available in that category",
        httpStatus.BAD_REQUEST
      );
    }

    const latestPost = await txc.product.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 1,
    });

    const generatedId = generateNewID("P-", latestPost[0]?.id);

    payload.id = generatedId;

    const product = await txc.product.create({
      data: payload,
    });

    const isCategoryBrandExist = await txc.categoryBrand.findFirst({
      where: {
        brandId: product.brandId,
        categoryId: product.categoryId,
      },
    });

    if (!isCategoryBrandExist) {
      await txc.categoryBrand.create({
        data: {
          brandId: product.brandId,
          categoryId: product.categoryId,
        },
      });
    }

    return product;
  });

  return result;
};

const bulkCreate = async (payload: Product[]): Promise<Product[]> => {
  const results: Product[] = [];
  await prisma.$transaction(
    async (txc) => {
      await asyncForEach(payload, async (product: Product) => {
        const newProductBody = { ...product };

        const latestPost = await txc.product.findMany({
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 1,
        });

        const generatedId = generateNewID("P-", latestPost[0]?.id);

        newProductBody.id = generatedId;

        console.log(newProductBody.id);

        const newProduct = await txc.product.create({
          data: newProductBody,
        });

        const isCategoryBrandExist = await txc.categoryBrand.findFirst({
          where: {
            brandId: newProduct.brandId,
            categoryId: newProduct.categoryId,
          },
        });

        if (!isCategoryBrandExist) {
          await txc.categoryBrand.create({
            data: {
              brandId: newProduct.brandId,
              categoryId: newProduct.categoryId,
            },
          });
        }

        results.push(newProduct);
      });
    },
    { timeout: 100000 }
  );

  return results;
};

const getProducts = async (
  queryFeatures: IQueryFeatures
): Promise<IQueryResult<Product>> => {
  const whereConditions: Prisma.ProductWhereInput =
    prismaHelper.findManyQueryHelper<Prisma.ProductWhereInput>(queryFeatures, {
      searchFields: ["title"],
      relationalFields: {
        categoryId: "category",
        brandId: "brand",
        subCategoryId: "subCategory",
      },
    });

  const query: Prisma.ProductFindManyArgs = {
    where: whereConditions,
    skip: queryFeatures.skip || undefined,
    take: queryFeatures.limit || undefined,
    orderBy: queryFeatures.sort,
  };

  if (
    queryFeatures.populate &&
    Object.keys(queryFeatures.populate).length > 0
  ) {
    query.include = {
      _count: true,
      ...queryFeatures.populate,
    };
  } else {
    if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
      query.select = { id: true, ...queryFeatures.fields };
    }
  }
  const [result, count] = await prisma.$transaction([
    prisma.product.findMany(query),
    prisma.product.count({ where: whereConditions }),
  ]);

  return {
    data: result,
    total: count,
  };
};

const getSingleProduct = async (
  id: string,
  queryFeatures: IQueryFeatures
): Promise<Partial<Product> | null> => {
  const query: Prisma.ProductFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (
    queryFeatures.populate &&
    Object.keys(queryFeatures.populate).length > 0
  ) {
    query.include = {
      _count: true,
      ...queryFeatures.populate,
    };
  } else {
    if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
      query.select = { id: true, ...queryFeatures.fields };
    }
  }

  const result: Partial<Product> | null = await prisma.product.findUnique(
    query
  );

  return result;
};

const update = async (
  id: string,
  payload: Partial<Product>
): Promise<Partial<Product> | null> => {
  const result = await prisma.$transaction(async (txc) => {
    if (payload.subCategoryId) {
      let categoryIdForSubCategory: string;
      if (payload.categoryId) {
        categoryIdForSubCategory = payload.categoryId;
      } else {
        const updatingProduct = await txc.product.findUnique({
          where: {
            id,
          },
        });

        if (!updatingProduct) {
          throw new AppError("Product Not Found", httpStatus.NOT_FOUND);
        }

        categoryIdForSubCategory = updatingProduct?.categoryId;
      }
      const subCategoryExist = await txc.category.findUnique({
        where: {
          id: categoryIdForSubCategory,
        },
        include: {
          subCategories: true,
        },
      });

      const isCatSubOk = subCategoryExist?.subCategories.find(
        (subCat) => subCat.id === payload.subCategoryId
      );

      if (!isCatSubOk) {
        throw new AppError(
          "Sub Category Is not available in that category",
          httpStatus.BAD_REQUEST
        );
      }
    }

    const updatedProduct = await txc.product.update({
      where: {
        id,
      },
      data: payload,
    });

    if (payload.categoryId || payload.brandId) {
      const isCategoryBrandExist = await txc.categoryBrand.findFirst({
        where: {
          brandId: updatedProduct.brandId,
          categoryId: updatedProduct.categoryId,
        },
      });

      if (!isCategoryBrandExist) {
        await txc.categoryBrand.create({
          data: {
            brandId: updatedProduct.brandId,
            categoryId: updatedProduct.categoryId,
          },
        });
      }
    }

    return updatedProduct;
  });

  return result;
};

const deleteProduct = async (id: string) => {
  const result = await prisma.$transaction(async (txc) => {
    const deletedProduct = await txc.product.delete({
      where: {
        id,
      },
    });

    if (deletedProduct) {
      const isCategoryBrandExist = await txc.product.findFirst({
        where: {
          brandId: deletedProduct.brandId,
          categoryId: deletedProduct.categoryId,
        },
      });

      if (!isCategoryBrandExist) {
        await txc.categoryBrand.delete({
          where: {
            categoryId_brandId: {
              categoryId: deletedProduct.categoryId,
              brandId: deletedProduct.brandId,
            },
          },
        });
      }
    }

    return deletedProduct;
  });

  return result;
};

const productService = {
  create,
  getProducts,
  getSingleProduct,
  update,
  deleteProduct,
  bulkCreate,
};

export default productService;
