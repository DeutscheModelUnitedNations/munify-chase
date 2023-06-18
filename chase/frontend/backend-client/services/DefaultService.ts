/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Check the authentication status of the user calling this method.
     * @returns any Default Response
     * @throws ApiError
     */
    public getApiAuthStatus(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/auth/status',
            errors: {
                401: `Default Response`,
            },
        });
    }

    /**
     * Check the authentication status of the user calling this method.
     * @returns any Default Response
     * @throws ApiError
     */
    public headApiAuthStatus(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'HEAD',
            url: '/api/auth/status',
            errors: {
                401: `Default Response`,
            },
        });
    }

}
