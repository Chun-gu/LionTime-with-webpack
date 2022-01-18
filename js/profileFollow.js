const API_URL = 'http://146.56.183.55:5050/';
const MY_ID = sessionStorage.getItem('my-id');
const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');
const TOKEN = sessionStorage.getItem('my-token');
const TARGET_ID = '61ca638ab5c6cd18084e447d';
const TARGET_ACCOUNTNAME = location.href.split('?')[1];
// const TARGET_ACCOUNTNAME = 'hey_binky';
const isMyProfile = MY_ACCOUNTNAME === TARGET_ACCOUNTNAME;

const isFollowersPage = localStorage.getItem('is-followers-page') === 'true';
localStorage.removeItem('is-followers-page');

const pageName = document.querySelector('.page-name');
if (isFollowersPage) {
    document.title = '팔로워';
    pageName.textContent = 'Followers';
} else {
    document.title = '팔로잉';
    pageName.textContent = 'Followings';
}

// 로그인
// (async function login() {
//     try {
//         const res = await fetch(API_URL + 'user/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 user: {
//                     email: 'testEmail@test.com',
//                     password: 'testpassword',
//                 },
//             }),
//         });
//         const resJson = await res.json();
//         const { _id, accountname, token } = resJson.user;
//         sessionStorage.setItem('token', token);
//         sessionStorage.setItem('my-accountname', accountname);
//         sessionStorage.setItem('my-id', _id);
//     } catch (err) {}
// })();

const usersList = document.querySelector('.users-list');
const limit = 15;
let skip = 0;
async function fetchData(endpoint) {
    try {
        const res = await fetch(
            API_URL +
                `profile/${TARGET_ACCOUNTNAME}/${endpoint}/?limit=${limit}&skip=${skip}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-type': 'application/json',
                },
            }
        );
        skip += limit;
        const resJson = await res.json();
        return resJson;
    } catch (err) {
        console.log(err);
    }
}

async function getFollowsData() {
    const followsData = isFollowersPage
        ? await fetchData('follower')
        : await fetchData('following');
    return followsData;
}

function makeFollowsItem(follows) {
    const { accountname, image, username, intro, follower, following } =
        follows;
    const followsItem = document.createElement('li');
    followsItem.classList.add('users-list-item');
    followsItem.dataset.accountname = accountname;
    const img = document.createElement('img');
    img.classList.add('user-img');
    if (image.slice(0, 4) === 'http') {
        img.setAttribute('src', image);
    } else {
        img.setAttribute('src', API_URL + image);
    }
    img.setAttribute(
        'onError',
        "this.src='http://146.56.183.55:5050/Ellipse.png'"
    );
    img.dataset.accountname = accountname;
    const div = document.createElement('div');
    div.classList.add('user-profile');
    const span = document.createElement('span');
    span.classList.add('user-name');
    span.textContent = username;
    span.dataset.accountname = accountname;
    div.append(span);
    if (!!intro) {
        const p = document.createElement('p');
        p.classList.add('user-intro');
        p.textContent = intro;
        p.dataset.accountname = accountname;
        div.append(p);
    }
    const button = document.createElement('button');
    button.classList.add('btn-follow');
    if (!isFollowersPage) {
        if (following.includes(MY_ID)) {
            button.classList.add('cancel');
        }
    } else {
        if (follower.includes(MY_ID)) {
            button.classList.add('cancel');
        }
    }
    followsItem.append(img);
    followsItem.append(div);
    followsItem.append(button);
    return followsItem;
}

async function printFollowsList(followsData) {
    for (const follows of followsData) {
        const followsItem = makeFollowsItem(follows);
        usersList.append(followsItem);
    }
}

function followsIoCb(entries, followsIo) {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            followsIo.unobserve(entry.target);
            const followsData = await getFollowsData();
            if (followsData.length === 0) {
                followsIo.disconnect();
            } else {
                printFollowsList(followsData);
                observeLastItem(
                    followsIo,
                    document.querySelectorAll('.users-list-item')
                );
            }
        }
    });
}

const followsIo = new IntersectionObserver(followsIoCb);

function observeLastItem(followsIo, items) {
    const lastItem = items[items.length - 1];
    followsIo.observe(lastItem);
}

(async function initFollows() {
    const followsData = await getFollowsData();
    if (followsData.length === 0) {
        usersList.textContent = '그리고 아무도 없었다...';
        return;
    }
    printFollowsList(followsData);
    observeLastItem(followsIo, document.querySelectorAll('.users-list-item'));
})();

// 기능 분기
usersList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-follow')) {
        e.target.classList.toggle('cancel');
        return;
    }
    if (
        e.target.classList.contains('user-img') ||
        e.target.classList.contains('user-name') ||
        e.target.classList.contains('user-intro')
    ) {
        const target_accountname = e.target.dataset.accountname;
        location.href = `../pages/profile.html?${target_accountname}`;
        return;
    }
});
