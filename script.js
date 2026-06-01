//======================
// Data User Default (Master & Admin)
//======================
let users = [
    { username: "masterkvt", password: "master123", role:"master", email:"master@kvt.com", hp:"081234567890", saldo:0, pin:"1111", referral:"MASTER001" },
    { username: "admin1kvt", password: "admin123", role:"admin", email:"admin1@kvt.com", hp:"0811111111", saldo:0, pin:"2222", referral:"ADMIN001" },
    { username: "admin2kvt", password: "admin456", role:"admin", email:"admin2@kvt.com", hp:"0822222222", saldo:0, pin:"3333", referral:"ADMIN002" }
];

//======================
// REGISTER MEMBER
//======================
function registerMember(e){
    e.preventDefault();
    let username = document.getElementById('regUsername').value;
    let email = document.getElementById('regEmail').value;
    let hp = document.getElementById('regHP').value;
    let password = document.getElementById('regPassword').value;
    let pin = document.getElementById('regPin').value;
    let referral = document.getElementById('regReferral').value || "";

    if(!username || !email || !hp || !password || !pin){
        alert('Semua field wajib diisi!');
        return;
    }

    // Cek username sudah ada?
    let exist = users.find(u=>u.username===username);
    if(exist){
        alert('Username sudah terdaftar!');
        return;
    }

    // Buat User ID otomatis
    let userID = "KVT" + String(users.length + 1).padStart(6,'0');

    users.push({ username,password,role:"member", email, hp, saldo:0, pin, referral, userID });
    alert('Akun berhasil dibuat! User ID: '+userID);
    localStorage.setItem('users', JSON.stringify(users));
    window.location.href = 'login.html';
}

//======================
// LOGIN
//======================
function loginUser(e){
    e.preventDefault();
    let username = document.getElementById('loginUsername').value;
    let password = document.getElementById('loginPassword').value;

    // Ambil users dari localStorage jika ada
    let storedUsers = JSON.parse(localStorage.getItem('users'));
    if(storedUsers) users = storedUsers;

    let user = users.find(u=>u.username===username && u.password===password);

    if(!user){
        alert('Username atau password salah!');
        return;
    }

    // Simpan login
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Redirect sesuai role
    if(user.role==="master" || user.role==="admin"){
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
}

//======================
// CEK LOGIN HALAMAN MEMBER
//======================
function checkLoginMember(){
    let loggedIn = localStorage.getItem('loggedIn');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!loggedIn || !currentUser || currentUser.role!=="member"){
        alert('Silahkan login dulu!');
        window.location.href = 'login.html';
    } else {
        document.getElementById('displayUsername').innerText = currentUser.username;
        document.getElementById('displayUserID').innerText = currentUser.userID || 'Belum ada';
        document.getElementById('displayEmail').innerText = currentUser.email;
        document.getElementById('displayHP').innerText = currentUser.hp;
        document.getElementById('saldoDisplay').innerText = 'Rp ' + Number(currentUser.saldo).toLocaleString('id-ID');
    }
}

//======================
// CEK LOGIN HALAMAN ADMIN
//======================
function checkLoginAdmin(){
    let loggedIn = localStorage.getItem('loggedIn');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!loggedIn || !currentUser || (currentUser.role!=="admin" && currentUser.role!=="master")){
        alert('Hanya admin/master yang bisa mengakses!');
        window.location.href = 'login.html';
    } else {
        document.getElementById('displayAdminUsername').innerText = currentUser.username;
        renderUserTable();
    }
}

//======================
// LOGOUT
//======================
function logoutUser(){
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    alert('Logout berhasil!');
    window.location.href = 'login.html';
}

//======================
// TOP UP SALDO
//======================
function topUpSaldo(){
    let amount = prompt('Masukkan jumlah top up (contoh: 50000)');
    if(amount && !isNaN(amount)){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.saldo += Number(amount);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // update users array
        let users = JSON.parse(localStorage.getItem('users'));
        let idx = users.findIndex(u=>u.username===currentUser.username);
        users[idx] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));

        document.getElementById('saldoDisplay').innerText = 'Rp '+Number(currentUser.saldo).toLocaleString('id-ID');
        alert('Top Up berhasil Rp '+Number(amount).toLocaleString('id-ID'));
    }
}

//======================
// TARIK DUIT (pakai PIN)
//======================
function tarikDuit(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let pin = prompt('Masukkan PIN Keluarkan Duit');
    if(pin !== currentUser.pin){
        alert('PIN salah!');
        return;
    }
    let amount = prompt('Masukkan jumlah tarik duit');
    if(amount && !isNaN(amount) && Number(amount)<=currentUser.saldo){
        currentUser.saldo -= Number(amount);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // update users array
        let users = JSON.parse(localStorage.getItem('users'));
        let idx = users.findIndex(u=>u.username===currentUser.username);
        users[idx] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));

        document.getElementById('saldoDisplay').innerText = 'Rp '+Number(currentUser.saldo).toLocaleString('id-ID');
        alert('Berhasil tarik Rp '+Number(amount).toLocaleString('id-ID'));
    } else {
        alert('Jumlah tarik tidak valid!');
    }
}

//======================
// RENDER USER TABLE DI ADMIN
//======================
function renderUserTable(){
    let tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.forEach((u,i)=>{
        let row = `<tr>
            <td>${u.userID || '-'}</td>
            <td>${u.username}</td>
            <td>${u.role}</td>
            <td>${u.email}</td>
            <td>${u.hp}</td>
            <td>Rp ${Number(u.saldo).toLocaleString('id-ID')}</td>
            <td>${u.referral || '-'}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}
