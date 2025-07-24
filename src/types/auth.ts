import z from "zod";

export const loginSchema = z.object({
	username: z.string().nonempty("Username tidak boleh kosong"),
	password: z.string().nonempty("Password tidak boleh kosong"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
