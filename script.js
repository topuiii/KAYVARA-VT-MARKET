// Data default master & admin
let users = [
    { username: "masterkvt", password: "master123", role:"master", email:"master@kvt.com", hp:"081234567890", saldo:0, pin:"1111", referral:"MASTER001" },
    { username: "admin1kvt", password: "admin123", role:"admin", email:"admin1@kvt.com", hp:"0811111111", saldo:0, pin:"2222", referral:"ADMIN001" },
    { username: "admin2kvt", password: "admin456", role:"admin", email:"admin2@kvt.com", hp:"0822222222", saldo:0, pin:"3333", referral:"ADMIN002" }
];

// Ambil users dari localStorage
let storedUsers = JSON.parse(localStorage.getItem('users'));
if(storedUsers) users = storedUsers;

// REGISTER MEMBER
function registerMember(e){
    e.preventDefault();
    let username = document.getElementById('regUsername').value;
    let email = document.getElementById('regEmail').value;
    let hp = document.getElementById('regHP').value;
    let password = document.getElementById('regPassword').value;
    let pin = document.getElementById('regPin').value;
    let referral = document.getElementById('regReferral').value || "";

    if(users.find(u=>u.username===username)){ alert('Username sudah ada'); return; }

    let userID = "KVT" + String(users.length+1).padStart(6,'0');
    users.push({username,password,role:"member",email,hp,saldo:0,pin,referral,userID});
    localStorage.setItem('users', JSON.stringify(users));
    alert('Berhasil daftar! User ID: '+userID);
    window.location.href='login.html';
}

// LOGIN
function loginUser(e){
    e.preventDefault();
    let username = document.getElementById('loginUsername').value;
    let password = document.getElementById('loginPassword').value;
    let user = users.find(u=>u.username===username && u.password===password);
    if(!user){ alert('Username atau password salah'); return; }
    localStorage.setItem('loggedIn','true');
    localStorage.setItem('currentUser',JSON.stringify(user));
    if(user.role==="master" || user.role==="admin") window.location.href='admin.html';
    else window.location.href='index.html';
}

// CEK LOGIN MEMBER
function checkLoginMember(){
    let loggedIn = localStorage.getItem('loggedIn');
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(!loggedIn || !user || user.role!=="member"){ alert('Silahkan login dulu'); window.location.href='login.html'; return; }
    document.getElementById('displayUsername').innerText=user.username;
    document.getElementById('displayUserID').innerText=user.userID || '-';
    document.getElementById('displayEmail').innerText=user.email;
    document.getElementById('displayHP').innerText=user.hp;
    document.getElementById('saldoDisplay').innerText='Rp '+Number(user.saldo).toLocaleString('id-ID');
}

// CEK LOGIN ADMIN
function checkLoginAdmin(){
    let loggedIn = localStorage.getItem('loggedIn');
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(!loggedIn || !user || (user.role!=="master" && user.role!=="admin")){ alert('Hanya admin/master'); window.location.href='login.html'; return; }
    document.getElementById('displayAdminUsername').innerText=user.username;
    renderUserTable();
}

// LOGOUT
function logoutUser(){
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    alert('Logout berhasil');
    window.location.href='login.html';
}

// TOP UP
function topUpSaldo(){
    let amount = prompt('Masukkan jumlah top up');
    if(amount && !isNaN(amount)){
        let user = JSON.parse(localStorage.getItem('currentUser'));
        user.saldo += Number(amount);
        updateUser(user);
        document.getElementById('saldoDisplay').innerText='Rp '+Number(user.saldo).toLocaleString('id-ID');
        alert('Top up berhasil Rp '+Number(amount).toLocaleString('id-ID'));
    }
}

// TARIK DUIT
function tarikDuit(){
    let user = JSON.parse(localStorage.getItem('currentUser'));
    let pin = prompt('Masukkan PIN tarik duit');
    if(pin !== user.pin){ alert('PIN salah'); return; }
    let amount = prompt('Masukkan jumlah tarik duit');
    if(amount && !isNaN(amount) && Number(amount)<=user.saldo){
        user.saldo -= Number(amount);
        updateUser(user);
        document.getElementById('saldoDisplay').innerText='Rp '+Number(user.saldo).toLocaleString('id-ID');
        alert('Berhasil tarik Rp '+Number(amount).toLocaleString('id-ID'));
    } else { alert('Jumlah tidak valid'); }
}

// UPDATE USERS ARRAY
function updateUser(user){
    let idx = users.findIndex(u=>u.username===user.username);
    users[idx]=user;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// RENDER TABLE ADMIN
function renderUserTable(){
    let tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML='';
    users.forEach(u=>{
        tableBody.innerHTML+=`<tr>
            <td>${u.userID||'-'}</td>
            <td>${u.username}</td>
            <td>${u.role}</td>
            <td>${u.email}</td>
            <td>${u.hp}</td>
            <td>Rp ${Number(u.saldo).toLocaleString('id-ID')}</td>
            <td>${u.referral||'-'}</td>
        </tr>`;
    });
}
