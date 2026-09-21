import http from "k6/http";
import { check } from "k6";

const BASE_URL = "http://localhost:3000";
const TOKEN = __ENV.JWT_TOKEN;

export const options = {
    vus: 10,
    duration: "30s",

    thresholds: {
        http_req_failed: ["rate<0.01"],
        http_req_duration: [
            "p(95)<100",
        ],
    },
};

export default function () {
    const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;

    const payload = JSON.stringify({
        nama: `Load Test ${uniqueId}`,
        email: `load-${uniqueId}@example.com`,
        password: "Password123!",
        no_hp: `081234${String(__VU).padStart(6, "0")}`,
        jenis_kelamin: "L",
        role: "user",
    });

    const response = http.post(
        `${BASE_URL}/api/users`,
        payload,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );

    check(response, {
        "status is 201": (r) => r.status === 201,
    });
}