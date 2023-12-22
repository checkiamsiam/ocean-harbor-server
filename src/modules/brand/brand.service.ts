import { Brand, Prisma } from "@prisma/client";
import prismaHelper from "../../helpers/prisma.helper";
import {
  IQueryFeatures,
  IQueryResult,
} from "../../interfaces/queryFeatures.interface";
import prisma from "../../shared/prismaClient";
import { generateNewID } from "../../utils/generateId.util";

const create = async (payload: Brand): Promise<Brand> => {
  const result = await prisma.$transaction(async (txc) => {
    const latestPost = await txc.brand.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    const generatedId = generateNewID("B-", latestPost[0]?.id);
    payload.id = generatedId;
    const result = await txc.brand.create({
      data: payload,
    });
    return result;
  });

  return result;
};

const getBrands = async (
  queryFeatures: IQueryFeatures
): Promise<IQueryResult<Brand>> => {
  const whereConditions: Prisma.BrandWhereInput =
    prismaHelper.findManyQueryHelper<Prisma.BrandWhereInput>(queryFeatures, {
      searchFields: ["title"],
    });

  const query: Prisma.BrandFindManyArgs = {
    where: whereConditions,
    skip: queryFeatures.skip || undefined,
    take: queryFeatures.limit || undefined,
    orderBy: queryFeatures.sort,
  };

  if (
    queryFeatures.populate &&
    Object.keys(queryFeatures.populate).length > 0
  ) {
    const queryFeaturePopulateCopy: Prisma.BrandInclude = {
      ...queryFeatures.populate,
    };

    if (queryFeatures.populate.categories) {
      queryFeaturePopulateCopy.categories = {
        include: {
          category: true,
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
    prisma.brand.findMany(query),
    prisma.brand.count({ where: whereConditions }),
  ]);

  return {
    data: result,
    total: count,
  };
};

const getSingleBrand = async (
  id: string,
  queryFeatures: IQueryFeatures
): Promise<Partial<Brand> | null> => {
  const query: Prisma.BrandFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (
    queryFeatures.populate &&
    Object.keys(queryFeatures.populate).length > 0
  ) {
    const queryFeaturePopulateCopy: Prisma.BrandInclude = {
      ...queryFeatures.populate,
    };

    if (queryFeatures.populate.categories) {
      queryFeaturePopulateCopy.categories = {
        include: {
          category: true,
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

  const result: Partial<Brand> | null = await prisma.brand.findUnique(query);

  return result;
};

const update = async (
  id: string,
  payload: Partial<Brand>
): Promise<Partial<Brand> | null> => {
  const result: Partial<Brand> | null = await prisma.brand.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteBrand = async (id: string) => {
  const result: Partial<Brand> | null = await prisma.brand.delete({
    where: {
      id,
    },
  });

  return result;
};

const brandService = {
  create,
  getBrands,
  getSingleBrand,
  update,
  deleteBrand,
};

export default brandService;
