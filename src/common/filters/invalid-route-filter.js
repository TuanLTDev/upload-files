import { InValidHttpResponse } from '../response';

export class InvalidRouteFilter {
    filter(req, res) {
        return InValidHttpResponse.toNotFoundResponse(`Can not get ${req.path}`).toResponse(res);
    }
}
