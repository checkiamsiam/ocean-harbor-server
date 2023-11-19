import { CustomerStatus, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwt.helper";
import prisma from "../../shared/prismaClient";
import { comparePassword } from "../../utils/bcrypt.util";
import AppError from "../../utils/customError.util";
import { ILoginUser, ILoginUserResponse } from "./auth.interface";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (!isUserExist) {
    throw new AppError("User does not exist", httpStatus.NOT_FOUND);
  }

  if (
    isUserExist.password &&
    !(await comparePassword(password, isUserExist.password))
  ) {
    throw new AppError("Password is incorrect", httpStatus.UNAUTHORIZED);
  }

  if (isUserExist.role === UserRole.customer && isUserExist.customerId) {
    const isCustomerExist = await prisma.customer.findUnique({
      where: { id: isUserExist.customerId },
    });
    if (isCustomerExist?.status === CustomerStatus.disabled) {
      throw new AppError("User is Temporary disabled", httpStatus.UNAUTHORIZED);
    }
  }

  const accessToken = jwtHelpers.createToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
      username: isUserExist.username,
      userId: isUserExist.id,
    },
    config.jwt.secret,
    config.jwt.expiresIn
  );

  return {
    accessToken,
  };
};

export const authService = {
  loginUser,
};
