import { Admin, Customer, Prisma, User, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import prismaHelper from "../../helpers/prisma.helper";
import {
  IQueryFeatures,
  IQueryResult,
} from "../../interfaces/queryFeatures.interface";
import prisma from "../../shared/prismaClient";
import { hashPassword } from "../../utils/bcrypt.util";
import AppError from "../../utils/customError.util";
import { generateNewID } from "../../utils/generateId.util";

const profile = async (user: JwtPayload): Promise<User> => {
  const include =
    user.role === UserRole.admin ? { admin: true } : { customer: true };
  const result = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      ...include,
    },
  });

  if (!result) {
    throw new AppError("User Not Found", httpStatus.NOT_FOUND);
  }

  return result;
};

const createCustomer = async (
  customerData: Customer,
  user: User
): Promise<Customer | null> => {
  const result = await prisma.$transaction(async (txc) => {
    const latestPost = await txc.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    const generatedId = generateNewID("U-", latestPost[0]?.id);

    customerData.id = generatedId;

    const customer = await txc.customer.create({
      data: customerData,
    });
    user.password = await hashPassword(user.password);
    await txc.user.create({
      data: {
        ...user,
        id: customer.id,
        customerId: customer.id,
      },
    });

    return customer;
  });

  return result;
};

const createAdmin = async (
  adminData: Admin,
  user: User
): Promise<Admin | null> => {
  const result = await prisma.$transaction(async (txc) => {
    const latestPost = await txc.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    const generatedId = generateNewID("U-", latestPost[0]?.id);
    adminData.id = generatedId;
    const admin = await txc.admin.create({
      data: adminData,
    });
    user.password = await hashPassword(user.password);
    await txc.user.create({
      data: {
        ...user,
        id: admin.id,
        adminId: admin.id,
      },
    });
    return admin;
  });

  return result;
};

const getCustomers = async (
  queryFeatures: IQueryFeatures
): Promise<IQueryResult<Customer>> => {
  const whereConditions: Prisma.CustomerWhereInput =
    prismaHelper.findManyQueryHelper<Prisma.CustomerWhereInput>(queryFeatures, {
      searchFields: [
        "name",
        "companyName",
        "companyType",
        "companyRegNo",
        "companyDetails",
        "taxNumber",
        "address",
        "city",
        "country",
        "phone",
      ],
    });

  const query: Prisma.CustomerFindManyArgs = {
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
    prisma.customer.findMany(query),
    prisma.customer.count({ where: whereConditions }),
  ]);

  return {
    data: result,
    total: count,
  };
};

const getAdmins = async (
  queryFeatures: IQueryFeatures
): Promise<IQueryResult<Admin>> => {
  const whereConditions: Prisma.AdminWhereInput =
    prismaHelper.findManyQueryHelper<Prisma.AdminWhereInput>(queryFeatures, {
      searchFields: ["name", "phone"],
    });

  const query: Prisma.AdminFindManyArgs = {
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
      ...queryFeatures.populate,
    };
  } else {
    if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
      query.select = { id: true, ...queryFeatures.fields };
    }
  }

  const [result, count] = await prisma.$transaction([
    prisma.admin.findMany(query),
    prisma.admin.count({ where: whereConditions }),
  ]);

  return {
    data: result,
    total: count,
  };
};

const getSingleCustomer = async (
  id: string,
  queryFeatures: IQueryFeatures
): Promise<Partial<Customer> | null> => {
  const query: Prisma.CustomerFindUniqueArgs = {
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

  const result: Partial<Customer> | null = await prisma.customer.findUnique(
    query
  );

  return result;
};

const updateCustomer = async (
  id: string,
  customerData: Partial<Customer>,
  user: Partial<User>
): Promise<Customer | null> => {
  const result = await prisma.$transaction(async (txc) => {
    const customer = await txc.customer.update({
      where: {
        id,
      },
      data: {
        ...customerData,
      },
    });
    if (user.password) {
      user.password = await hashPassword(user.password);
    }
    await txc.user.update({
      where: {
        id,
      },
      data: {
        ...user,
      },
    });

    return customer;
  });

  return result;
};

const userService = {
  createCustomer,
  createAdmin,
  profile,
  getCustomers,
  getAdmins,
  updateCustomer,
  getSingleCustomer,
};

export default userService;
