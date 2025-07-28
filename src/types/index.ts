import z from "zod";

export const filterBase = z.object({
	q: z.string().optional().default(""),
	page: z.number().optional().default(0),
	limit: z.number().optional().default(9),
});

export const idBase = z.object({
	id: z.string().nonempty("ID tidak boleh kosong"),
});
