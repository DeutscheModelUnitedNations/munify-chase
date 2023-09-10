/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List all available conferences
     * @returns any Default Response
     * @throws ApiError
     */
    public postApiConferenceCreate({
body,
}: {
body?: {
/**
 * The creation token required to create a conference. Will be consumed on use.
 */
token: string;
/**
 * The conference to create.
 */
conference: {
name: string;
};
},
}): CancelablePromise<{
id: number;
name: string;
}> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/conference/create',
            body: body,
        });
    }

    /**
     * List all available conferences
     * @returns any Default Response
     * @throws ApiError
     */
    public getApiConferenceList(): CancelablePromise<Array<{
id: number;
name: string;
}>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/conference/list',
        });
    }

}
