import z from "zod";

export type ErrorResponse = {
	name: string;
	message: string;
};

export type ResponseBase<T> = {
	success: boolean;
	message: string;
	data: T | null;
	error: ErrorResponse | null;
};

export type ResponseBaseArray<T> = {
	success: boolean;
	message: string;
	data: { items: T[]; meta: Pagination } | null;
	error: ErrorResponse | null;
};

export type ErrorBase = {
	success: boolean;
	message: string;
	data: null;
	error: ErrorResponse;
};

export type Pagination = {
	total: number | undefined;
	page: number | undefined;
	limit: number | undefined;
	totalPages: number | undefined;
};

export const filterBase = z.object({
	q: z.string().optional().default(""),
	page: z.number().optional().default(0),
	limit: z.number().optional().default(9),
});

export const idBase = z.object({
	id: z.string().nonempty("ID tidak boleh kosong"),
});
