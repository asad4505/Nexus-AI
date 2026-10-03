import proxy from "express-http-proxy"

//custom proxy with header for passing user id to the services
export const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        parseReqBody: false,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {

            // Pass user id header from gateway to downstream services
            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
            }

            // Preserve the original Content-Type header including multipart boundary.
            // Without this, express-http-proxy may drop or corrupt the boundary string
            // which causes multer on the downstream service to return a 400 Bad Request.
            if (srcReq.headers["content-type"]) {
                proxyReqOpts.headers["content-type"] = srcReq.headers["content-type"]
            }

            return proxyReqOpts
        }
    })
}