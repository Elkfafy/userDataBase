/* Information **
** الاسم : احمد عادل احمد حسن الكفافي
** name: ahmed adel ahmed hassan elkfafy
/***************/
/* Variables */
    /* Selectors */
const usersContainer = document.querySelector('#usersContainer');
const singleUser = document.querySelector('#singleUser');
const addForm = document.querySelector('#addForm');
const editForm = document.querySelector('#editForm');
    /*************/
const userHeaders = [
    {
        key: 'id', 
        default: true,
        defaultValue: Date.now()
    },
    {
        key: 'name',
        default: false,
        defaultValue: '',
    },
    {
        key: 'phone',
        default: false,
        defaultValue: '',
     },
     {
        key: 'age',
        default: false,
        defaultValue: 0,
      },
      {
        key: 'status',
        default: true,
        defaultValue: false,
}];
const users = getLocalStorageItem('users');
const user = getLocalStorageItem('user', 'object');
/*************/

/* Functions */
    /* Local Storage */
function getLocalStorageItem(item, dataType = 'array') {
    let myItem;
    try{
        myItem = JSON.parse(localStorage.getItem(item)) || [];
        if(dataType === 'array' && !myItem.length) throw new Error(`The ${item} should be an array!`);
    } catch(error) {
        console.log(error.message);
        myItem = [];
    }
    return myItem;
}
function insertInLocalStorage(name, data) {
    try {
        localStorage.setItem(name, JSON.stringify(data));
    } catch(error) {
        console.log(error.message);
    }
}
    /***************/
const createMyElement = (tag, parent, innerText = null, classes = null) => {
    const myElement = document.createElement(tag);
    myElement.innerHTML = innerText;
    myElement.classList = classes;
    parent.append(myElement);
    return myElement;
}
const drawUser = (tag, parent, inner = null, headers = [], user = null, classes = null) => {
    headers.forEach(head => {
        let innerText = '';
        if (head.key === 'status') {
            innerText = user[head.key]? 'available' : 'notAvailable';
            classes = user[head.key]? 'text-success' : 'text-danger';
        } else if (inner === 'usersDraw') {
            innerText = `${user[head.key]}`;
        } else if (inner === 'userShow') {
            innerText = `${head.key}: ${user[head.key]}`;
        }
        createMyElement(tag, parent, innerText, classes);
    });
}
    /* Button Functions */
const toggleState = (i) => {
    users[i].status = !users[i].status
    insertInLocalStorage('users', users);
    drawUsers(users);

}

const deleteUser = (i) => {
    users.splice(i,1);
    console.log(users) 
    insertInLocalStorage('users', users);
    drawUsers(users);
}

const editUser = i => {
    const user = users[i];
    user.index = i;
    insertInLocalStorage('user', user);
    document.location.href = 'edit.html';
}

const showUser = (user) => {
    singleUser.innerHTML = ''
    singleUser.style.display = 'block';
    drawUser('p', singleUser, 'userShow',userHeaders, user)
}
    /********************/
    /* Drawing functions */
const drawUsers = (users) => {
    usersContainer.innerHTML = '';
    if (!users.length) {
        let tr = createMyElement("tr", usersContainer);
        const td = createMyElement("td", tr, "There isn't any data yet", 'text-center alert alert-danger')
        td.colSpan = '6';
    }
    users.forEach((user, i) => {
        const tr = createMyElement('tr', usersContainer)
        drawUser('td', tr, 'usersDraw', userHeaders, user)
        const td = createMyElement("td", tr)
        const stateBtn = createMyElement("button", td, "status", "btn btn-primary mx-2")
        stateBtn.addEventListener("click", () => toggleState(i))
        
        const delBtn = createMyElement("button", td, "delete", "btn btn-danger mx-2")
        delBtn.addEventListener("click", () => deleteUser(i))
        
        const editBtn = createMyElement("button", td, "edit", "btn btn-warning mx-2")
        editBtn.addEventListener('click', () => editUser(i))


        const showBtn = createMyElement("button", td, "show", "btn btn-success mx-2")
        showBtn.addEventListener('click', () => showUser(users[i]))
        
        
    })
}
/*************/
/* Program */
    /* Adding New User */
if (addForm) {
    addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const target = event.target.elements;
        const user = {}
        userHeaders.forEach(head => {
            if (head.default) {
                user[head.key] = head.defaultValue;
            } else {
                user[head.key] = target[head.key].value;
            }
        })
        users.push(user);
        insertInLocalStorage('users', users);
        document.location.href = 'index.html';
    })
}
    /*******************/
    /* Index Page */
if (usersContainer) {
    drawUsers(users);
}
    /**************/
    /* Edit Page */
if (editForm) {
    const editArea = ['name', 'phone', 'age'];
    const elements = editForm.elements;
    editArea.forEach(area => {
        elements[area].setAttribute('value', user[area]);
    })
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        editArea.forEach(area => {
            users[user.index][area] = elements[area].value;
        });
        insertInLocalStorage('users', users);
        document.location.href = 'index.html';
    })
}
    /*************/
/***********/