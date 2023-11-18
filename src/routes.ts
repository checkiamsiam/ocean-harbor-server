import express, { Router } from "express";
import accountReqRoutes from "./modules/accountRequest/accountRequest.route";
import authRoutes from "./modules/auth/auth.route";
import brandRoutes from "./modules/brand/brand.route";
import categoryRoutes from "./modules/category/category.route";
import productRoutes from "./modules/product/product.route";
import subCategoryRoutes from "./modules/subCategory/subCategory.route";
import userRoutes from "./modules/user/user.route";

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
  {
    path: "/product",
    route: productRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
