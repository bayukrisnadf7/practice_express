import http from "k6/http";
import { check } from "k6";

const BASE_URL = "http://localhost:3000";
const TOKEN = __ENV.JWT_TOKEN;

export const options = {
    stages: [
        { duration: "30s", target: 100 },
        { duration: "30s", target: 500 },
        { duration: "30s", target: 1000 },
        { duration: "30s", target: 0 },
    ],

    thresholds: {
        http_req_failed: ["rate<0.01"],

        http_req_duration: [
            "p(95)<50",
            "p(99)<100",
        ],
    },
};

export default function () {
    const response = http.get(
        `${BASE_URL}/api/users?page=1&limit=10`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );

    check(response, {
        "status is 200": (r) => r.status === 200,
        "response has data": (r) => r.body.length > 0,
    });
}
