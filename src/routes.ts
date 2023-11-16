import express, { Router } from "express";
import authRoutes from "./modules/auth/auth.route";
import brandRoutes from "./modules/brand/brand.route";
import categoryRoutes from "./modules/category/category.route";
import subCategoryRoutes from "./modules/subCategory/subCategory.route";
import userRoutes from "./modules/user/user.route";
import accountReqRoutes from "./modules/accountRequest/accountRequest.route";

const router: Router = express.Router();

const routes: { path: string; route: Router }[] = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/account-request",
    route: accountReqRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/sub-category",
    route: subCategoryRoutes,
  },
  {
    path: "/brand",
    route: brandRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
