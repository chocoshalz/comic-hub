import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  uniqueIndex,
  date,
  numeric,
  integer,
  foreignKey
} from 'drizzle-orm/pg-core';



// Define the columns for each table correctly, like you did for 'users' and 'roles'.

// Users Table (already correct)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  accountStatus: text('accountStatus').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
}, (users) => {
  return {
    uniqueIdx: uniqueIndex("users_email_unique_idx").on(users.email)
  };
});

/*
CREATE TABLE profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  userId UUID NOT NULL,
  fullName TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pinCode TEXT NOT NULL,
  phone TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users (id)
);

*/
// Profile Table
export const profile = pgTable('profile', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('userId').notNull(), // Foreign key referencing the users table
  fullName: text('fullName').notNull(),
  profilepic: text('profilepic'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pinCode').notNull(),
  phone: text('phone').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
}, (profile) => {
  return {
    foreignKeyUser: foreignKey({
      columns: [profile.userId],
      foreignColumns: [users.id], // Correctly references the `id` column in the `users` table
    }),
  };
});

// Roles Table (already correct)
export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  roleName: text('roleName').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
}, (roles) => {
  return {
    uniqueIdx: uniqueIndex("roles_rolename_unique_idx").on(roles.roleName)
  };
});

// UserRoles Table (needs columns definition)
export const userRoles = pgTable('user_roles', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('userId').references(() => users.id).notNull(),
  roleId: uuid('roleId').references(() => roles.id).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});



export const comics = pgTable('comics', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  title: text('title').notNull(),
  genre: text('genre').notNull(),
  author: text('author').notNull(),
  publisher: text('publisher').notNull(),
  publicationyear: text('publicationyear').notNull(),
  price: numeric('price').notNull().default('0'), // Default as string
  description: text('description'),
  banner: text('banner'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const wishlist = pgTable('wishlist', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('userId').references(() => users.id).notNull(),
  comicId: uuid('comicId').references(() => comics.id).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const cart = pgTable('cart', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('userId').references(() => users.id).notNull(),
  comicId: uuid('comicId').references(() => comics.id).notNull(),
  quantity: integer('quantity').default(1).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});


// Orders Table (needs columns definition)
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('userId').references(() => users.id).notNull(),
  comicId: uuid('comicId').references(() => comics.id).notNull(),
  orderDate: timestamp('orderDate').defaultNow().notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  orderId: uuid('orderId').references(() => orders.id).notNull(),
  comicId: uuid('comicId').references(() => comics.id).notNull(),
  quantity: integer('quantity').notNull(),
  price: numeric('price').notNull(),
});

// Reviews Table (needs columns definition)
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('userId').references(() => users.id).notNull(),
  comicId: uuid('comicId').references(() => comics.id).notNull(),
  rating: integer('rating').notNull(),
  reviewText: text('reviewText').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});


// Permissions Table (already correct)
export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  permissionName: text('permissionName').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
}, (permissions) => {
  return {
    uniqueIdx: uniqueIndex("permissions_permissionname_unique_idx").on(permissions.permissionName)
  };
});

// RolePermissions Table (needs columns definition)
export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  roleId: uuid('roleId').references(() => roles.id).notNull(),
  permissionId: uuid('permissionId').references(() => permissions.id).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});


