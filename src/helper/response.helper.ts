import type {
	ErrorResponse,
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
		success,
		message,
		data,
		error,
	};
}

export function formatResponseArray<T>(
	success: boolean,
	message: string,
	data: T[],
	error: null,
): ResponseBaseArray<T> {
	return {
		success,
		message,
		data,
		error,
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
		success,
		message,
		data,
		error,
	};
}

// export function formatErrorResponse(
// 	message: string,
// 	error: Error | null,
// ): ResponseBase<null> {
// 	const errorResponse =
// 		error instanceof Error
// 			? {
// 					name: error.name,
// 					message: error.message,
// 				}
// 			: error;
// 	return formatResponse(false, message, null, errorResponse);
// }
