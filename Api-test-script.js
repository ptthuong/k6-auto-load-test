import http from 'k6/http';
import {check, group, sleep} from 'k6';
const config = JSON.parse(open("./config.json"));

const USERNAME = `${randomString(10)}@example.com`; // Set your own email or `${randomString(10)}@example.com`;
const PASSWORD = 'techtalk2021';

export function setup() {
    // register a new user and authenticate via a Bearer token.
    let res = http.post(`${config.baseUrl}/user/register/`, {
        first_name: 'Crocodile',
        last_name: 'Owner',
        username: USERNAME,
        password: PASSWORD,
    });

    check(res, { 'created user': (r) => r.status === 201 });

    let loginRes = http.post(`${config.baseUrl}/auth/token/login/`, {
        username: USERNAME,
        password: PASSWORD,
    });

    let authToken = loginRes.json('access');
    check(authToken, { 'logged in successfully': () => authToken !== '' });

    return authToken;
}

export default (authToken) => { // VU code
    group('Get a single public crocodile.', () => {
        // 1. List all public crocodiles
        let response = http.get(`${config.baseUrl}/public/crocodiles/`);
        const arrIds = response.json().map(item => item.id);
        check(arrIds, {
            'Public Crocodiles is not empty': (arr) => arr.length !== 0
        });

        thinkTime();

        // 2. View details of a public crocodile
        const id = randomId(arrIds);
        response = http.get(`${config.baseUrl}/public/crocodiles/${id}/`);
        check(response, {
            'Response status of details public crocodile request is 200': (r) => r.status === 200
        });
    });

    group('Create private crocodile ', () => {
        const requestConfigWithTag = (tag) => ({
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            tags: tag
        });

        // 1. Create private crocodile
        const payload = {
            name: `Name ${randomString(10)}`,
            sex: 'M',
            date_of_birth: '2001-01-01'
        };

        const createResponse = http.post(
            `${config.baseUrl}/my/crocodiles/`,
            payload,
            requestConfigWithTag({ name: 'Create' }));
        
        check(createResponse, { 'Croc created correctly': (r) => r.status === 201 })
    })
}

function randomId(arrIds) {
    const max = arrIds.length;
    if (max === 0)
        return;
    const randomIndex = Math.floor(Math.random() * max);
    return arrIds[randomIndex];
}

function thinkTime() {
    sleep(Math.random() * (10 - 3) + 3);
}

function randomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyz';
    let res = '';
    while (length--) res += charset[(Math.random() * charset.length) | 0];
    return res;
}
