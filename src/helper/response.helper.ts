import type {
	Pagination,
	ResponseBase,
	ResponseBaseArray,
	ResponseBasePagination,
} from "../types/api";

export function formatResponse<T>(
	success: boolean,
	message: string,
	data: T,
	error: null,
): ResponseBase<T> {
	return {
		data,
		error,
		message,
		success,
	};
}

export function formatResponseArray<T>(
	success: boolean,
	message: string,
	data: T[],
	error: null,
): ResponseBaseArray<T> {
	return {
		data,
		error,
		message,
		success,
	};
}

export function formatResponsePagination<T>(
	success: boolean,
	message: string,
	data: {
		items: T[];
		meta: Pagination;
	},
	error: null,
): ResponseBasePagination<T> {
	return {
		data,
		error,
		message,
		success,
	};
}
