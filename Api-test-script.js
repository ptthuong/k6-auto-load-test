import http from 'k6/http';
import {check, group, sleep, fail} from 'k6';
const config = JSON.parse(open("./config.json"));

export default function () {
    group('Get a single public crocodile.', () => {
        // 1. List all public crocodiles
        let response = http.get(`${config.baseUrl}/public/crocodiles/`);
        const arrIds = response.json().map(item => item.id);
        check(arrIds, {
            'Public Crocodiles is not empty': (arr) => arr.length !== 0
        });

        // thinkTime();

        // // 2. View details of a public crocodile
        // const id = randomId(arrIds);
        // response = http.get(`${config.baseUrl}/public/crocodiles/${id}/`);
        // check(response, {
        //     'Response status of details public crocodile request is 200': (r) => r.status === 200
        // });
    });

    // group('Create my own crocodile ', () => {
    //     // 1. Login
    //
    //     // 2. Create crocodile
    //     // 3. View created crocodile
    // })
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