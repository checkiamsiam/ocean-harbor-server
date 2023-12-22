import { Prisma, SubCategory } from "@prisma/client";
import prismaHelper from "../../helpers/prisma.helper";
import {
  IQueryFeatures,
  IQueryResult,
} from "../../interfaces/queryFeatures.interface";
import prisma from "../../shared/prismaClient";
import { generateNewID } from "../../utils/generateId.util";

const create = async (payload: SubCategory): Promise<SubCategory> => {
  const result = await prisma.$transaction(async (txc) => {
    const latestPost = await txc.subCategory.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    const generatedId = generateNewID("SC", latestPost[0]?.id);
    payload.id = generatedId;
    const result = await txc.subCategory.create({
      data: payload,
    });
    return result;
  });

  return result;
};

const getSubCategories = async (
  queryFeatures: IQueryFeatures
): Promise<IQueryResult<SubCategory>> => {
  const whereConditions: Prisma.SubCategoryWhereInput =
    prismaHelper.findManyQueryHelper<Prisma.SubCategoryWhereInput>(
      queryFeatures,
      {
        searchFields: ["title"],
        relationalFields: {
          categoryId: "category",
        },
      }
    );

  const query: Prisma.SubCategoryFindManyArgs = {
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
    prisma.subCategory.findMany(query),
    prisma.subCategory.count({ where: whereConditions }),
  ]);

  return {
    data: result,
    total: count,
  };
};

const getSingleSubCategory = async (
  id: string,
  queryFeatures: IQueryFeatures
): Promise<Partial<SubCategory> | null> => {
  const query: Prisma.SubCategoryFindUniqueArgs = {
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

  const result: Partial<SubCategory> | null =
    await prisma.subCategory.findUnique(query);

  return result;
};

const update = async (
  id: string,
  payload: Partial<SubCategory>
): Promise<Partial<SubCategory> | null> => {
  const result: Partial<SubCategory> | null = await prisma.subCategory.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteSubCategory = async (id: string) => {
  const result: Partial<SubCategory> | null = await prisma.subCategory.delete({
    where: {
      id,
    },
  });

  return result;
};

const subSubCategoryService = {
  create,
  getSubCategories,
  getSingleSubCategory,
  update,
  deleteSubCategory,
};

export default subSubCategoryService;
