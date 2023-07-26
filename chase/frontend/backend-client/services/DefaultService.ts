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
    public getApiConferenceList(): CancelablePromise<Array<{
id: number;
name: string;
}>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/conference/list',
        });
    }

    /**
     * Update a conference
     * @returns any Default Response
     * @throws ApiError
     */
    public patchApiConference({
body,
}: {
body?: {
/**
 * The new conference data
 */
conference: {
name?: any;
admins?: {
create?: any;
connectOrCreate?: any;
upsert?: any;
set?: any;
disconnect?: any;
delete?: any;
connect?: any;
update?: any;
updateMany?: any;
deleteMany?: any;
};
};
/**
 * The id of the conference to update
 */
conferenceId: number;
},
}): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/conference',
            body: body,
        });
    }

    /**
     * Create a conference
     * @returns any Default Response
     * @throws ApiError
     */
    public postApiConference({
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
admins?: {
create?: any;
connectOrCreate?: any;
connect?: any;
};
};
},
}): CancelablePromise<{
id: number;
name: string;
}> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/conference',
            body: body,
        });
    }

}
