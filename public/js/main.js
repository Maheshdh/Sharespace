const login_form = document.getElementById("login-form")
if(login_form){
    login_form.addEventListener('submit',(event) => {
      event.preventDefault();
      var emailAddressInput = document.getElementById('emailAddressInput').value;
      const passwordInput = document.getElementById('passwordInput').value;
      try {
        if(emailAddressInput === undefined || passwordInput === undefined) throw "One of the argument is absent";
        validate_email(emailAddressInput);
        validate_password(passwordInput);
        login_form.submit();
      } catch (error) {
        console.log(error);
        document.getElementById("error_js").innerHTML = error;
      }
    })
    }

    const registration = document.getElementById('registration-form');
    if(registration){
    registration.addEventListener('submit',(event) => {
      event.preventDefault();
    
      const firstNameInput = document.getElementById('firstNameInput').value;
      const lastNameInput = document.getElementById('lastNameInput').value;
      const confirmPasswordInput = document.getElementById('confirmPasswordInput').value;
      const roleInput = document.getElementById('phoneNumberInput').value;
      const emailAddressInput = document.getElementById('emailAddressInput').value;
      const passwordInput = document.getElementById('passwordInput').value;
    console.log("Taher");
      try {
        if(firstNameInput === undefined || lastNameInput === undefined || emailAddressInput === undefined || passwordInput === undefined || roleInput === undefined || confirmPasswordInput === undefined){ throw "One or more argument is missing"; }
        validate_string(firstNameInput);
        validate_string(lastNameInput);
        validate_email(emailAddressInput);
        validate_password(passwordInput);
        if(passwordInput !== confirmPasswordInput) throw "Password and confirmPassword are not equal";
        registration.submit();
      } catch (error) {
          console.log(error);
          document.getElementById("error_js").innerHTML = error;
      }
    })
    }


    function validate_string(str) {
        if(str === null) throw "String is null";
        if(typeof str !== "string") throw "Argument is not a string"
        if(str.trim().length === 0) throw "Argument is empty"
        const regnum = /[0-9]/g;
        if(str.match(regnum) !== null) throw "String Argument has number";
        if(str.length<2 || str.length>25) throw "String has either characters less than 2 or greter than 25";
        return str.trim();
    }
    function validate_email(email) {
        if(email === null) throw "String is null";
        if(typeof email !== "string") throw "Email provided is not string";
        if(!(email.split(".").length===2)) throw ". is not there in email"
        if(!(email.split(".")[1].length>0)) throw "Email does not have anything after .";
        if(!(email.split(".")[0].length>2)) throw "Email does not have anything before .";
        if(!(email.split("@").length===2)) throw "@ is not there in email"
        if(!(email.split("@")[1].length>3)) throw "Email does not have anything in between @ and .com";
        return email.toLowerCase();
    }
    function validate_password(password){
        if(password === null) throw "String is null";
        if(typeof password !== "string") throw "Password is not a string";
        console.log(password.split(" "))
        if(password.split(" ").length>1) throw "Password has spaces present";
        if(password.trim().length === 0) throw "Password is empty";
        if(password.length<8) throw "Password is small";
        const regAlpha = /[A-Z]/g;
        const regnum = /[0-9]/g;
        const regspcchar = /[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g;
        if(password.match(regAlpha) ===null || password.match(regnum) ===null || password.match(regspcchar) ===null) throw "An uppercase, number and special charater is required in password";
    }        