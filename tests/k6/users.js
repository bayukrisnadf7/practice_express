import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    stages: [
        { duration: "10s", target: 10 },
        { duration: "20s", target: 50 },
        { duration: "20s", target: 100 },
        { duration: "10s", target: 0 },
    ],

    thresholds: {
        http_req_failed: ["rate<0.01"],
        http_req_duration: ["p(95)<200"],
    },
};

export default function () {
    const response = http.get(
        "http://localhost:3000/api/users?page=1&limit=10"
    );

    check(response, {
        "status is 200": (r) => r.status === 200,
        "response has data": (r) => r.body.length > 0,
    });

    sleep(1);
}