import { Admin, Customer, User, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prismaClient";
import { hashPassword } from "../../utils/bcrypt.util";
import AppError from "../../utils/customError.util";

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

const userService = {
  createCustomer,
  createAdmin,
  profile,
};

export default userService;
