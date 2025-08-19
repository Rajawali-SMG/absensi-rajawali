import z from "zod";

export const filterBase = z.object({
	limit: z.number().optional().default(9),
	page: z.number().optional().default(0),
	q: z.string().optional().default(""),
});

export const idBase = z.object({
	id: z.string().nonempty("ID tidak boleh kosong"),
});
