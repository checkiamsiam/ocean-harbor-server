import express, { Router } from "express";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import searchController from "./search.controller";

const searchRoutes: Router = express.Router();

searchRoutes.get("/", queryFeatures("multiple"), searchController.globalSearch);

export default searchRoutes;
