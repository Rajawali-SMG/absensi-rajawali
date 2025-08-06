import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { role, type user } from "../server/db/schema";
import { filterBase } from ".";

export type UserSelect = InferSelectModel<typeof user>;
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
	password: z
		.string()
		.nonempty("Password tidak boleh kosong")
		.max(50, "Password maksimal 50 karakter"),
});

export const userUpdateSchema = userCreateSchema
	.extend({
		id: z.uuid().nonempty("ID tidak boleh kosong"),
	})
	.omit({ password: true });

export const userUpdatePasswordSchema = z.object({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
	password: z
		.string()
		.nonempty("Password tidak boleh kosong")
		.max(50, "Password maksimal 50 karakter"),
	confirmPassword: z
		.string()
		.nonempty("Konfirmasi password tidak boleh kosong")
		.max(50, "Konfirmasi password maksimal 50 karakter"),
});

export const defaultValueUser = {
	email: "",
	name: "",
	password: "",
};

export const defaultValueUserUpdatePassword = {
	id: "",
	password: "",
	confirmPassword: "",
};

export const userFilter = filterBase;
