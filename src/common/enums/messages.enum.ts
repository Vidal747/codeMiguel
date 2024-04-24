export enum Messages {
	SUCCESSFUL = '¡Bien hecho! La operación se realizó con éxito.',
	INTERNAL_SERVER_ERROR = '¡Ups! Algo salió mal, estamos trabajando para resolverlo.',
	USER_NOT_EXISTS_OR_INACTIVE = '¡Ups! Parece que el usuario no está registrado o su cuenta está inactiva.',
	USER_BLOCKED_BY_ATTEMPTS = '¡Ups! Parece que tu cuenta está bloqueada por intentos fallidos. Inténtalo nuevamente más tarde.',
	USER_INPUT_INCORRECT_PASSWORD = '¡Ups! Verifica tus credenciales e inténtalo nuevamente.',
	USER_NOT_LOGGED = '¡Ups! Parece que no has iniciado sesión.',
	SIGN_OUT_SUCCESSFUL = '¡Hasta luego! Has cerrado sesión correctamente.',
	SESSION_EXPIRED = '¡Ups! Parece que tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
	USER_NOT_AUTHORIZED = '¡Ups! No tienes permisos para realizar esta acción.',
	NO_DATA_FOUND = '¡Ups! Parece que no hay datos registrados.',
	SUCCESSFULLY_CREATED = '¡Bien hecho! El registro se creó con éxito.',
	SUCCESSFULLY_UPDATED = '¡Bien hecho! El registro se actualizó con éxito.',
	SUCCESSFULLY_DELETED = '¡Bien hecho! El registro se eliminó con éxito.',
	ERROR_CREATING = '¡Ups! Imposible crear el registro.',
	ERROR_UPDATING = '¡Ups! Imposible actualizar el registro.',
	ERROR_DELETING = '¡Ups! Imposible eliminar el registro.',
}
