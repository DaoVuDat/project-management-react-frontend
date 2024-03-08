export type ErrorResponse = {
  status: string;
  message: string;
  error: string;
};

export function toErrorResponse(err: Error) {
	try {
		const { status, message, error } = JSON.parse(err.message);

		return {
			status: String(status),
			message: String(message),
			error: String(error),
		};
	} catch (error) {
		// Handle parsing error, e.g., log it or return a default ErrorResponse
		console.error('Error parsing JSON string:', error);
		return {
			status: 'unknown',
			message: 'Error parsing JSON string',
			error: 'ParsingError',
		};
	}
}