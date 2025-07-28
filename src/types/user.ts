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
	username: z
		.string()
		.nonempty("Username tidak boleh kosong")
		.max(50, "Username maksimal 50 karakter"),
	password: z
		.string()
		.nonempty("Password tidak boleh kosong")
		.max(128, "Password maksimal 128 karakter"),
	role: z.enum(["Super Admin", "Admin", "User"], {
		error: "Role tidak boleh kosong",
	}),
});

export const userUpdateSchema = userCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const defaultValueUser: UserInsert = {
	username: "",
	password: "",
	role: "User",
};

export const userFilter = filterBase.extend({
	role: z.enum(["Super Admin", "Admin", "User"]).optional(),
});
