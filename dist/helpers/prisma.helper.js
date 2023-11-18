"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findManyQueryHelper = (queryFeatures, options) => {
    const andConditions = [];
    if (queryFeatures.searchKey) {
        andConditions.push({
            OR: options.searchFields.map((field) => ({
                [field]: {
                    contains: queryFeatures.searchKey,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(queryFeatures.filters).length > 0) {
        andConditions.push({
            AND: Object.keys(queryFeatures.filters).map((key) => {
                if (options.relationalFields && options.relationalFields[key]) {
                    return {
                        [options.relationalFields[key]]: {
                            id: queryFeatures.filters[key],
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: queryFeatures.filters[key],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = (andConditions.length > 0 ? { AND: andConditions } : {});
    return whereConditions;
};
const prismaHelper = {
    findManyQueryHelper,
};
exports.default = prismaHelper;
