
export default {
    config: {
        "textApiUrl": "http://" + process.env.NGINX_HOST + "/text/api",
        "textLinkApiUrl": "http://" + process.env.NGINX_HOST + "/text/apiURL",
        "textLinkApiUrlcashed": "http://" + process.env.NGINX_HOST + "/text/apiURLcashed",
        "spacyApiUrl": "http://" + process.env.NGINX_HOST + "/concepts/api",
        "graphQueryApiUrl": "http://" + process.env.NGINX_HOST + "/graph/api",
        "statsApiUrl": "http://" + process.env.NGINX_HOST + "/graph/stats",
        "describeApiUrl": "http://" + process.env.NGINX_HOST + "/graph/describe"
    }
};