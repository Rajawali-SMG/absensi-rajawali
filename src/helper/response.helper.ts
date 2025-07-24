import type {
	ErrorResponse,
	Pagination,
	ResponseBase,
	ResponseBaseArray,
} from "../types/api";

export function formatResponse<T>(
	success: boolean,
	message: string,
	data: T | null,
	error: ErrorResponse | null,
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
	data: {
		items: T[];
		meta: Pagination;
	} | null,
	error: ErrorResponse | null,
): ResponseBaseArray<T> {
	return {
		success,
		message,
		data,
		error,
	};
}

export function formatErrorResponse(
	message: string,
	error: Error | null,
): ResponseBase<null> {
	const errorResponse =
		error instanceof Error
			? {
					name: error.name,
					message: error.message,
				}
			: error;
	return formatResponse(false, message, null, errorResponse);
}
