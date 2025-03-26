import { HTTP_STATUS } from '../enums/index.enum';
import { omit } from 'lodash';
export default async (callback: Function) => {
    try {
        const result = await callback();
        return {
            code: (result && result.code) || HTTP_STATUS.SUCCESS,
            result: Array.isArray(result) ? result : omit(result, ['code']),
        };
    } catch (error) {
        return {
            code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            result: null,
            message: error.message || 'SERVER_ERROR',
        };
    }
};
