import express, { Router } from "express";
import categoryRoutes from "./modules/category/category.route";

const router: Router = express.Router();

const routes: { path: string; route: Router }[] = [
  {
    path: "/category",
    route: categoryRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
