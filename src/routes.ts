import express, { Router } from "express";
import accountReqRoutes from "./modules/accountRequest/accountRequest.route";
import authRoutes from "./modules/auth/auth.route";
import brandRoutes from "./modules/brand/brand.route";
import categoryRoutes from "./modules/category/category.route";
import notificationRoutes from "./modules/notification/notification.route";
import orderRoutes from "./modules/order/order.route";
import productRoutes from "./modules/product/product.route";
import searchRoutes from "./modules/search/search.route";
import subCategoryRoutes from "./modules/subCategory/subCategory.route";
import userRoutes from "./modules/user/user.route";
import uploadRoutes from "./modules/upload/upload.route";

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
  {
    path: "/search",
    route: searchRoutes,
  },
  {
    path: "/order",
    route: orderRoutes,
  },
  {
    path: "/notification",
    route: notificationRoutes,
  },
  {
    path: "/upload",
    route: uploadRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
