-- RenameForeignKey
ALTER TABLE "category_brands" RENAME CONSTRAINT "category_brands_brandId_fkey" TO "category_brand_brand_id";

-- RenameForeignKey
ALTER TABLE "category_brands" RENAME CONSTRAINT "category_brands_categoryId_fkey" TO "category_brand_category_id";

-- RenameForeignKey
ALTER TABLE "order_items" RENAME CONSTRAINT "order_items_orderId_fkey" TO "order_item_order_id";

-- RenameForeignKey
ALTER TABLE "order_items" RENAME CONSTRAINT "order_items_productId_fkey" TO "order_item_product_id";

-- RenameForeignKey
ALTER TABLE "orders" RENAME CONSTRAINT "orders_customerId_fkey" TO "order_customer_id";

-- RenameForeignKey
ALTER TABLE "products" RENAME CONSTRAINT "products_brandId_fkey" TO "product_brand_id";

-- RenameForeignKey
ALTER TABLE "products" RENAME CONSTRAINT "products_categoryId_fkey" TO "product_category_id";

-- RenameForeignKey
ALTER TABLE "products" RENAME CONSTRAINT "products_subCategoryId_fkey" TO "product_sub_category_id";

-- RenameForeignKey
ALTER TABLE "sub_categories" RENAME CONSTRAINT "sub_categories_categoryId_fkey" TO "sub_category_category_id";

-- RenameForeignKey
ALTER TABLE "user_notifications" RENAME CONSTRAINT "user_notifications_customerId_fkey" TO "customer_notification_customer_id";

-- RenameForeignKey
ALTER TABLE "users" RENAME CONSTRAINT "users_adminId_fkey" TO "user_admin_id";

-- RenameForeignKey
ALTER TABLE "users" RENAME CONSTRAINT "users_customerId_fkey" TO "user_customer_id";
