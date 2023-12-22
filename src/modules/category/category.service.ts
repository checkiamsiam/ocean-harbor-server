import { Category, Prisma } from "@prisma/client";
import prismaHelper from "../../helpers/prisma.helper";
import {
  IQueryFeatures,
  IQueryResult,
} from "../../interfaces/queryFeatures.interface";
import prisma from "../../shared/prismaClient";
import { generateNewID } from "../../utils/generateId.util";

const create = async (payload: Category): Promise<Category> => {
  const result = await prisma.$transaction(async (txc) => {
    const latestPost = await txc.category.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    const generatedId = generateNewID("C-", latestPost[0]?.id);
    payload.id = generatedId;
    const result = await txc.category.create({
      data: payload,
    });
    return result;
  });
  return result;
};

const getCategories = async (
  queryFeatures: IQueryFeatures
): Promise<IQueryResult<Category>> => {
  const whereConditions: Prisma.CategoryWhereInput =
    prismaHelper.findManyQueryHelper<Prisma.CategoryWhereInput>(queryFeatures, {
      searchFields: ["title"],
    });

  const query: Prisma.CategoryFindManyArgs = {
    where: whereConditions,
    skip: queryFeatures.skip || undefined,
    take: queryFeatures.limit || undefined,
    orderBy: queryFeatures.sort,
  };

  if (
    queryFeatures.populate &&
    Object.keys(queryFeatures.populate).length > 0
  ) {
    const queryFeaturePopulateCopy: Prisma.CategoryInclude = {
      ...queryFeatures.populate,
    };

    if (queryFeatures.populate.brands) {
      queryFeaturePopulateCopy.brands = {
        include: {
          brand: true,
        },
      };
    }

    query.include = {
      _count: true,
      ...queryFeaturePopulateCopy,
    };
  } else {
    if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
      query.select = { id: true, ...queryFeatures.fields };
    }
  }
  const [result, count] = await prisma.$transaction([
    prisma.category.findMany(query),
    prisma.category.count({ where: whereConditions }),
  ]);

  return {
    data: result,
    total: count,
  };
};

const getSingleCategory = async (
  id: string,
  queryFeatures: IQueryFeatures
): Promise<Partial<Category> | null> => {
  const query: Prisma.CategoryFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (
    queryFeatures.populate &&
    Object.keys(queryFeatures.populate).length > 0
  ) {
    const queryFeaturePopulateCopy: Prisma.CategoryInclude = {
      ...queryFeatures.populate,
    };

    if (queryFeatures.populate.brands) {
      queryFeaturePopulateCopy.brands = {
        include: {
          brand: true,
        },
      };
    }

    query.include = {
      _count: true,
      ...queryFeaturePopulateCopy,
    };
  } else {
    if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
      query.select = { id: true, ...queryFeatures.fields };
    }
  }

  const result: Partial<Category> | null = await prisma.category.findUnique(
    query
  );

  return result;
};

const update = async (
  id: string,
  payload: Partial<Category>
): Promise<Partial<Category> | null> => {
  const result: Partial<Category> | null = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteCategory = async (id: string) => {
  const result: Partial<Category> | null = await prisma.category.delete({
    where: {
      id,
    },
  });

  return result;
};

const categoryService = {
  create,
  getCategories,
  getSingleCategory,
  update,
  deleteCategory,
};

export default categoryService;
