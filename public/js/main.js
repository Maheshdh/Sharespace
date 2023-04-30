const login_form = document.getElementById("login-form")
if(login_form){
    login_form.addEventListener('submit',(event) => {
     
      event.preventDefault();
      var emailAddressInput = document.getElementById('emailAddressInput').value;
      const passwordInput = document.getElementById('passwordInput').value;
      
      try {
        if(emailAddressInput === undefined || passwordInput === undefined) throw "One of the argument is absent";
        checkEmail(emailAddressInput,"Email address");
        checkPassword(passwordInput,"Password");
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
      const phoneNumberInput = document.getElementById('phoneNumberInput').value;
      const emailAddressInput = document.getElementById('emailAddressInput').value;
      const passwordInput = document.getElementById('passwordInput').value;

      try {
        if(firstNameInput === undefined || lastNameInput === undefined || emailAddressInput === undefined || passwordInput === undefined || phoneNumberInput === undefined || confirmPasswordInput === undefined){ throw "One or more argument is missing"; }
        checkString(firstNameInput,"First Name");
        checkString(lastNameInput,"Last name");
        checkEmail(emailAddressInput,"Email address");
        checkPassword(passwordInput,"Password");
        checkPhoneNumber(phoneNumberInput,"Phone number")
        if(passwordInput !== confirmPasswordInput) throw "Password and confirmPassword are not equal";
        registration.submit();
      } catch (error) {
          console.log(error);
          document.getElementById("error_js").innerHTML = error;
      }

    })
    }


    const addListing = document.getElementById('add_listing_form');
    if(addListing){
    addListing.addEventListener("submit",(event)=>{
        event.preventDefault();
         console.log("addListingJS running")
        try {
            console.log(document.getElementById("listing_TitleInput").value)
            let titleInput = checkString(document.getElementById("listing_TitleInput").value, 'Listing Title')
            let descriptionInput = checkString(document.getElementById("listing_DescriptionInput").value, 'Listing Description')
            let addressInput = checkString(document.getElementById("listing_AddressInput").value, 'Listing Address')
            let priceInput = checkPrice(document.getElementById("listing_PriceInput").value, 'Listing Price')
            let lenghtInput = checkDimension(document.getElementById("listing_LengthInput").value, 'Listing Length')
            let widthInput = checkDimension(document.getElementById("listing_WidthInput").value, 'Listing Width')
            let heightInput = checkDimension(document.getElementById("listing_HeightInput").value, 'Listing Height')
            let longitudeInput = 'LONGITUDE GOES HERE'
            let latitudeInput = 'LATITUDE GOES HERE'
            let availableStartInput = checkDate(document.getElementById("listing_AvailableStartInput").value, 'Listing Start Date')
            let availableEndInput = checkDate(document.getElementById("listing_AvailableEndInput").value, 'Listing End Date')   
            addListing.submit();
        } catch (error) {
            console.log(error)
            document.getElementById("error_js").innerHTML = error;
        }
    })}

    const comment_form = document.getElementById("comment_input_form");
    if(comment_form){
        comment_form.addEventListener("submit",(event)=>{
            event.preventDefault();
        const comment = document.getElementById("listing_comment_input").value;
        const rating = document.getElementById("rating_select").value;
        const listingId = document.getElementById("listing_id_input").value;
        if (comment && rating && listingId){
         
        //set up AJAX request config
        let requestConfig = {
          method: 'POST',
          url: '/listing/addComment',
          contentType: 'application/json',
          data: JSON.stringify({
            comment: comment,
            rating: rating,
            listingId: listingId
          })
        };
        //AJAX Call. Gets the returned HTML data, binds the click event to the link and appends the new todo to the page
        $.ajax(requestConfig).then(function (responseMessage) {
          console.log(responseMessage);
          console.log("Adding html")    
          document.getElementById("listing_comments").innerHTML += `<p>${comment}</p>`;
        });}
    })
    }

    function checkPhoneNumber (phone_no, varName) {
        // TODO: Use Google's libphonenumber library
        let phoneRegEx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        if (phone_no.match(phoneRegEx)) {
          return phone_no 
        } else throw `Error: ${varName} entered is not valid`
      }
    function checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`
        if (typeof id !== 'string') throw `Error:${varName} must be a string`
        id = id.trim();
        if (id.length === 0) throw `Error: ${varName} cannot be an empty string or just spaces`
        return id;
      }

    function checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`
        strVal = strVal.trim();
        if (strVal.length === 0)
          throw `Error: ${varName} cannot be an empty string or string with just spaces`
        if (!isNaN(strVal))
          throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
        return strVal;
      }

    function checkEmail(mail, varName) {
        if (!mail) throw `Error: You must supply a ${varName}!`;
        if (typeof mail !== "string") throw `Error: ${varName} must be a string!`;
        mail = mail.trim().toLowerCase();

        let emailAddressRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (mail.match(emailAddressRegEx)) {
          return mail
        } else throw 'Error: Email Address should be of format: example@example.com'
      }

    function checkList(list, varName) {
        if (list.length === 0) throw `Error List ${varName} should not be empty`
        // TODO: Check if elements inside list are not empty strings?
      }

    function checkPassword(password, varName) {
        if (!password) throw `Error: You must supply a ${varName}!`;
        if (typeof password !== "string") throw `Error: ${varName} must be a string!`;
        if (password.trim().length === 0) throw `Error: ${varName} cannot be empty`;
        if (password.match(" ")) throw `Error: ${varName} cannot contain spaces`;

        let passwordRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/ //Must be betwwen 7-15 characters, 1 numer, 1 special
        if (password.match(passwordRegEx)) {
          return password 
        } else throw 'Error: Password must be between 7-15 characters with at least one numeric digit and a special character'
      }

    function checkDate(date,varName){
        // First check for the pattern
        if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date))
        throw `Error: You must enter a valid ${varName}!`;
        // Parse the date parts to integers
        var parts = date.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if(year < 1000 || year > 3000 || month == 0 || month > 12)
        throw `Error: You must enter a valid ${varName}!`;

        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        if(!(day > 0 && day <= monthLength[month - 1])){
          throw `Error: You must enter a valid ${varName}!`;
        }
        return date
      }
        

    function checkPrice(price, varName) {
        if (!price) throw `Error: You must provide a ${varName}`
        if (price.trim() == '') throw `Error: You must provide a ${varName}`
        price = Number(price)
        if (isNaN(price) == true) throw `Error: ${varName} must be a number`
        if (price <= 0) throw `Error: ${varName} should be greater than 0`
        if (price > 1000000000) throw `Error: ${varName} should be lesser than 1,000,000,000`
        return price
      }

    function checkDimension(dimension, varName) {
        if (!dimension) throw `Error: You must provide a ${varName}`
        if (dimension.trim() == '') throw `Error: You must provide a ${varName}`
        dimension = Number(dimension)
        if (isNaN(dimension) == true) throw `Error: ${varName} must be a number`
        if (dimension <= 0) throw `Error: ${varName} should be greater than 0`
        if (dimension > 100) throw `Error: ${varName} should be lesser than 100`
        return dimension
      }