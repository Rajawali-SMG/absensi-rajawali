import z from "zod";

export const loginSchema = z.object({
	email: z.email("Email tidak valid").nonempty("Email tidak boleh kosong"),
	password: z.string().nonempty("Password tidak boleh kosong"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
