import { Admin, Customer, User } from "@prisma/client";
import prisma from "../../shared/prismaClient";
import { hashPassword } from "../../utils/bcrypt.util";

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
};

export default userService;
