import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { role, type user } from "../server/db/schema";
import { filterBase } from ".";

export type UserSelectDirty = InferSelectModel<typeof user>;
export type UserSelect = Omit<UserSelectDirty, "password">;
export type UserInsert = InferInsertModel<typeof user>;

export const roleSchema = createSelectSchema(role);
export type RoleType = z.infer<typeof roleSchema>;

export const userCreateSchema = z.object({
	email: z
		.email()
		.nonempty("Email tidak boleh kosong")
		.max(50, "Email maksimal 50 karakter"),
	name: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(50, "Nama maksimal 50 karakter"),
	// role: z.enum(["Super Admin", "Admin", "User"], {
	// 	error: "Role tidak boleh kosong",
	// }),
});

export const userUpdateSchema = userCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const defaultValueUser: UserInsert = {
	email: "",
	name: "",
	// role: "User",
};

export const userFilter = filterBase.extend({
	role: z.enum(["Super Admin", "Admin", "User"]).optional(),
});
