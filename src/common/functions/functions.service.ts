import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenerateResponseApi } from './functions.types';
import { Messages } from '../enums';
 
@Injectable()
export class FunctionsService {
	generateResponseApi(
		values: GenerateResponseApi,
		type: 'HttpException' | 'Objet' = 'HttpException',
	) {
		const { ok, status, message, data, issues, meta } = values;

		const response = {
			ok: ok || false,
			status: status || HttpStatus.INTERNAL_SERVER_ERROR,
			message:
				!message && !ok ? Messages.INTERNAL_SERVER_ERROR : message || Messages.SUCCESSFUL,
			data: data,
			meta: meta,
			issues: issues,
		};

		if (type === 'Objet') return response;
		else throw new HttpException(response, status || HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
 