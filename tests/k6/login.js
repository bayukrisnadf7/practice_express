import http from "k6/http";
import { check } from "k6";

const BASE_URL = "http://localhost:3000";

export const options = {
    stages: [
        { duration: "30s", target: 10 },
        { duration: "30s", target: 100 },
        { duration: "30s", target: 500 },
        { duration: "30s", target: 1000 },
        { duration: "30s", target: 2000 },
        { duration: "30s", target: 0 },
    ],

    thresholds: {
        http_req_failed: ["rate<0.01"],
        http_req_duration: [
            "p(95)<200",
            "p(99)<500",
        ],
    },
};

export default function () {
    const payload = JSON.stringify({
        email: "user1@example.com",
        password: "Password123!",
    });

    const response = http.post(
        `${BASE_URL}/api/auth/login`,
        payload,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    check(response, {
        "status is 200": (r) => r.status === 200,
        "has token": (r) => {
            try {
                return !!JSON.parse(r.body).token;
            } catch {
                return false;
            }
        },
    });
}