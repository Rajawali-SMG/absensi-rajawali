import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { user } from "../server/db/schema";

export type UserSelectDirty = InferSelectModel<typeof user>;
export type UserSelect = Omit<UserSelectDirty, "password">;
export type UserInsert = InferInsertModel<typeof user>;

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

export const userDeleteSchema = userUpdateSchema.pick({
	id: true,
});

export const defaultValueUser: UserInsert = {
	username: "",
	password: "",
	role: "User",
};

export const userFilter = z.object({
	q: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	role: z.enum(["Super Admin", "Admin", "User"]).optional(),
});
