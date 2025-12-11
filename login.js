document.getElementById('registration').addEventListener('submit', async function(e) {
       e.preventDefault();


    // read inputs from input fields
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;

    let msg = document.getElementById("message");
    msg.textContent="";

    // validate fname
    if(fname===""){
       msg.textContent=" You have to enter your firstname";
       return;
    }
    
    if(lname===""){
       msg.textContent=" You have to enter your lastname";
       return;
    }

    //validate email
    if(!email.includes("@") || !email.includes(".")) {
        msg.textContent="Enter a valid email";
        return;
    }
    
    //validate password length
    if(pass.length < 6) {
        msg.textContent= " Password must be 6 letters";
        return;
    }

    //if all details are perfect then show message
    msg.textContent = " Registration Successful !";
    msg.style.color = "green";


//all details are valid and send to server

fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fname, lname, email, password: pass })
    })
    .then(response => response.text())
    .then(data => {
        msg.textContent = data;
        msg.style.color = "red"; // success message
    })
    .catch(err => {
        msg.textContent = "Server error. Try again later.";
    })
});
