export type ErrorResponse = {
	name: string;
	message: string;
};

export type ResponseBase<T> = {
	success: boolean;
	message: string;
	data: T;
	error: null;
};

export type ResponseBaseArray<T> = {
	success: boolean;
	message: string;
	data: T[];
	error: null;
};

export type ResponseBasePagination<T> = {
	success: boolean;
	message: string;
	data: { items: T[]; meta: Pagination };
	error: null;
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
