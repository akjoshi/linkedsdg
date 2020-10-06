
export default {
    config: {
        "textApiUrl": "http://${NGINX_HOST}/text/api",
        "textLinkApiUrl": "http://${NGINX_HOST}/text/apiURL",
        "textLinkApiUrlcashed": "http://${NGINX_HOST}/text/apiURLcashed",
        "spacyApiUrl": "http://${NGINX_HOST}/concepts/api",
        "graphQueryApiUrl": "http://${NGINX_HOST}/graph/api",
        "statsApiUrl": "http://${NGINX_HOST}/graph/stats",
        "describeApiUrl": "http://${NGINX_HOST}/graph/describe"
    }
};