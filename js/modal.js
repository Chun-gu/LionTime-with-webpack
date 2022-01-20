const modalContainer = document.querySelector('.list-modal-container');
const modal = document.querySelector('.modal');
const dimd = document.querySelector('.dimd');

let bottomValue = 0;

document.addEventListener('click', (e) => {
    if (e.target.classList.value === 'btn-menu') {
        const menulist = createEle('li', 'class', 'list-modal-menu');
        const menuBtn = createEle('button', 'type', 'button');
        addAttr(menuBtn, 'class', 'btn-list close-chat-room');
        menuBtn.appendChild(document.createTextNode('채팅방 나가기'));
        menulist.appendChild(menuBtn);
        modalContainer.appendChild(menulist);

        bottomValue = modalContainer.childElementCount * 46 + 46;
        modal.style.bottom = `-${bottomValue}px`;

        if (modal.classList.value === 'modal') {
            createModal();
        } else {
            removeModal();
        }
    }

    console.log(e.target.classList.value);
    if (e.target.classList.value === 'btn-profile-menu') {
        const menulistfrist = createEle('li', 'class', 'list-modal-menu');
        const menulistSecond = createEle('li', 'class', 'list-modal-menu');
        const menuBtnSetting = createEle('button', 'type', 'button');
        const menuBtnLogOut = createEle('button', 'type', 'button');

        addAttr(menuBtnSetting, 'class', 'btn-list setting');
        menuBtnSetting.appendChild(document.createTextNode('설정 및 개인정보'));
        addAttr(menuBtnLogOut, 'class', 'btn-list logOut');
        menuBtnLogOut.appendChild(document.createTextNode('로그아웃'));

        menulistfrist.appendChild(menuBtnSetting);
        menulistSecond.appendChild(menuBtnLogOut);
        modalContainer.appendChild(menulistfrist);
        modalContainer.appendChild(menulistSecond);

        bottomValue = modalContainer.childElementCount * 46 + 46;
        modal.style.bottom = `-${bottomValue}px`;

        if (modal.classList.value === 'modal') {
            createModal();
        } else {
            removeModal();
        }
    }

    if (e.target.classList.value === 'btn-post-menu') {
        if(isMyProfile){
            const menulistfrist = createEle('li', 'class', 'list-modal-menu');
            const menulistSecond = createEle('li', 'class', 'list-modal-menu');
            const menuBtnSetting = createEle('button', 'type', 'button');
            const menuBtnLogOut = createEle('button', 'type', 'button');
    
            addAttr(menuBtnSetting, 'class', 'btn-list delete');
            menuBtnSetting.appendChild(document.createTextNode('삭제'));
            addAttr(menuBtnLogOut, 'class', 'btn-list update');
            menuBtnLogOut.appendChild(document.createTextNode('수정'));
    
            menulistfrist.appendChild(menuBtnSetting);
            menulistSecond.appendChild(menuBtnLogOut);
            modalContainer.appendChild(menulistfrist);
            modalContainer.appendChild(menulistSecond);
    
            bottomValue = modalContainer.childElementCount * 46 + 46;
            modal.style.bottom = `-${bottomValue}px`;
            if (modal.classList.value === 'modal') {
                createModal();
            } else {
                removeModal();
            }
        } else{
            const menulist = createEle('li', 'class', 'list-modal-menu');
            const menuBtn = createEle('button', 'type', 'button');
            addAttr(menuBtn, 'class', 'btn-list post-report');
            menuBtn.appendChild(document.createTextNode('신고하기'));
            menulist.appendChild(menuBtn);
            modalContainer.appendChild(menulist);
    
            bottomValue = modalContainer.childElementCount * 46 + 46;
            modal.style.bottom = `-${bottomValue}px`;
    
            if (modal.classList.value === 'modal') {
                createModal();
            } else {
                removeModal();
            }
        }
    }

    if (e.target.classList.value === 'btn-more-mini') {
        const menulistfrist = createEle('li', 'class', 'list-modal-menu');
        const menulistSecond = createEle('li', 'class', 'list-modal-menu');
        const menuBtnSetting = createEle('button', 'type', 'button');
        const menuBtnLogOut = createEle('button', 'type', 'button');

        addAttr(menuBtnSetting, 'class', 'btn-list delete');
        menuBtnSetting.appendChild(document.createTextNode('삭제'));
        addAttr(menuBtnLogOut, 'class', 'btn-list update');
        menuBtnLogOut.appendChild(document.createTextNode('수정'));

        menulistfrist.appendChild(menuBtnSetting);
        menulistSecond.appendChild(menuBtnLogOut);
        modalContainer.appendChild(menulistfrist);
        modalContainer.appendChild(menulistSecond);

        bottomValue = modalContainer.childElementCount * 46 + 46;
        modal.style.bottom = `-${bottomValue}px`;

        if (modal.classList.value === 'modal') {
            createModal();
        } else {
            removeModal();
        }
    }

    if (e.target.classList.value === 'btn-more-mini user') {
        const menulist = createEle('li', 'class', 'list-modal-menu');
        const menuBtn = createEle('button', 'type', 'button');
        addAttr(menuBtn, 'class', 'btn-list post-report');
        menuBtn.appendChild(document.createTextNode('신고하기'));
        menulist.appendChild(menuBtn);
        modalContainer.appendChild(menulist);

        bottomValue = modalContainer.childElementCount * 46 + 46;
        modal.style.bottom = `-${bottomValue}px`;

        if (modal.classList.value === 'modal') {
            createModal();
        } else {
            removeModal();
        }
    }

    if (e.target.classList.value === 'product-img') {
        const menulistfrist = createEle('li', 'class', 'list-modal-menu');
        const menulistSecond = createEle('li', 'class', 'list-modal-menu');
        const menulistThrid = createEle('li','class','list-modal-menu');

        const menuBtnSetting = createEle('button', 'type', 'button');
        const menuBtnLogOut = createEle('button', 'type', 'button');
        const menuBtnWeb = createEle('button','type','button');

        addAttr(menuBtnSetting, 'class', 'btn-list productDelete');
        menuBtnSetting.appendChild(document.createTextNode('삭제'));
        addAttr(menuBtnLogOut, 'class', 'btn-list productUpdate');
        menuBtnLogOut.appendChild(document.createTextNode('수정'));
        addAttr(menuBtnWeb, 'class', 'btn-list website');
        menuBtnWeb.appendChild(document.createTextNode('웹사이트에서 상품 보기'));

        menulistfrist.appendChild(menuBtnSetting);
        menulistSecond.appendChild(menuBtnLogOut);
        menulistThrid.appendChild(menuBtnWeb);

        modalContainer.appendChild(menulistfrist);
        modalContainer.appendChild(menulistSecond);
        modalContainer.appendChild(menulistThrid);

        bottomValue = modalContainer.childElementCount * 46 + 46;
        modal.style.bottom = `-${bottomValue}px`;

        if (modal.classList.value === 'modal') {
            createModal();
        } else {
            removeModal();
        }
    }


    //버튼 기능
    if (e.target.classList.value === 'btn-list close-chat-room') {
        history.back();
    } else if(e.target.classList.value === 'btn-list website'){
        const product = document.querySelector(".product-item");
        const productLink = product.getAttribute("href");
        location.href = productLink;
    }
});

dimd.addEventListener('click', () => {
    removeModal();
});

function createEle(eleName, attr, attrName) {
    const createEle = document.createElement(eleName);
    createEle.setAttribute(attr, attrName);
    return createEle;
}

function addAttr(ele, attr, attName) {
    ele = ele.setAttribute(attr, attName);
    return ele;
}

function removeModal() {
    bottomValue = modalContainer.childElementCount * 46 + 46;
    modal.style.bottom = `-${bottomValue}px`;
    dimd.classList.remove('on');
    setTimeout(function () {
        modal.classList.remove('on');
        while (modalContainer.hasChildNodes()) {
            modalContainer.removeChild(modalContainer.firstChild);
        }
    }, 100);
}

function createModal() {
    modal.classList.add('on');
    dimd.classList.add('on');
    setTimeout(function () {
        modal.style.bottom = '0px';
    }, 10);
}
