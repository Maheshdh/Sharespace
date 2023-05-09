const login_form = document.getElementById("login-form")
if (login_form) {
    login_form.addEventListener('submit',(event) => {
      event.preventDefault();
      // console.log("Taher");
      var emailAddressInput = document.getElementById('emailAddressInput').value;
      const passwordInput = document.getElementById('passwordInput').value;
      try {
        if(emailAddressInput === undefined || passwordInput === undefined) throw "One of the argument is absent";
        checkEmail(emailAddressInput,"Email address");
        checkPassword(passwordInput,"Password");
        login_form.submit();
      } catch (error) {
        document.getElementById("error_js").innerHTML = error;
      }
    }
    )
  }

const registration = document.getElementById('registration-form');
if (registration) {
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
          document.getElementById("error_js").innerHTML = error;
      }
})
}


const addListing = document.getElementById('add_listing_form');
if(addListing){
addListing.addEventListener("submit",(event)=>{
    event.preventDefault();
    try {
        let titleInput = checkString(document.getElementById("listing_TitleInput").value, 'Listing Title')
        let descriptionInput = checkString(document.getElementById("listing_DescriptionInput").value, 'Listing Description')
        let addressInput = checkString(document.getElementById("listing_AddressInput").value, 'Listing Address')
        let priceInput = checkPrice(document.getElementById("listing_PriceInput").value, 'Listing Price')
        let lenghtInput = checkDimension(document.getElementById("listing_LengthInput").value, 'Listing Length')
        let widthInput = checkDimension(document.getElementById("listing_WidthInput").value, 'Listing Width')
        let heightInput = checkDimension(document.getElementById("listing_HeightInput").value, 'Listing Height')
        let longitudeInput = checkLongitude(document.getElementById("listing_LongitudeInput").value,"Listing Longitude")
        let latitudeInput = checkLatitude(document.getElementById("listing_LatitudeInput").value,"Listing latitude")
        let availableStartInput = checkDate(document.getElementById("listing_AvailableStartInput").value, 'Listing Start Date')
        let availableEndInput = checkDate(document.getElementById("listing_AvailableEndInput").value, 'Listing End Date')   
        let a = new Date(availableStartInput);
        let b= new Date(availableEndInput);
        if(a>b) throw "Available end date is before available start date";
        addListing.submit();
    } catch (error) {
        document.getElementById("error_js").innerHTML = error;
    }
})}

const updateListing = document.getElementById('update_listing_form');
if(updateListing){
updateListing.addEventListener("submit",(event)=>{
    event.preventDefault();
    try {
        let titleInput = checkString(document.getElementById("listing_Update_TitleInput").value, 'Listing Title')
        let descriptionInput = checkString(document.getElementById("listing_Update_DescriptionInput").value, 'Listing Description')
        let addressInput = checkString(document.getElementById("listing_Update_AddressInput").value, 'Listing Address')
        let priceInput = checkPrice(document.getElementById("listing_Update_PriceInput").value, 'Listing Price')
        let lenghtInput = checkDimension(document.getElementById("listing_Update_LengthInput").value, 'Listing Length')
        let widthInput = checkDimension(document.getElementById("listing_Update_WidthInput").value, 'Listing Width')
        let heightInput = checkDimension(document.getElementById("listing_Update_HeightInput").value, 'Listing Height')
        let longitudeInput = checkLongitude(document.getElementById("listing_Update_LongitudeInput").value,"Listing Longitude")
        let latitudeInput = checkLatitude(document.getElementById("listing_Update_LatitudeInput").value,"Listing latitude")
        let availableStartInput = checkDate(document.getElementById("listing_Update_AvailableStartInput").value, 'Listing Start Date')
        let availableEndInput = checkDate(document.getElementById("listing_Update_AvailableEndInput").value, 'Listing End Date')   
        let a = new Date(availableStartInput);
        let b= new Date(availableEndInput);
        if(a>b) throw "Available end date is before available start date";
        updateListing.submit();
    } catch (error) {
        document.getElementById("error_js").innerHTML = error;
    }
})}

const review_form = document.getElementById("review_input_form");
if(review_form) {
  review_form.addEventListener("submit",(event) => {
    event.preventDefault();
    var comment,rating,listingId
    try {
        listingID = checkId(document.getElementById("listing_id_input").value,"Listing Id");
        rating = checkRating(document.getElementById("rating_select").value," Rating ");
        comment = checkString(document.getElementById("listing_comment_input").value," Comment");
    } catch (error) {
        document.getElementById("review_added").innerHTML = `<p class="reviewAdded-fail"> ${error} </p>`;
    }

    
    if (comment && rating !== undefined && listingID) {
      //set up AJAX request config
      let requestConfig = {
        method: 'POST',
        url: '/listing/addReview',
        contentType: 'application/json',
        data: JSON.stringify({
          comment: comment,
          rating: rating,
          listingID: listingID
        })
      };

      //AJAX Call. Gets the returned HTML data, binds the click event to the link and appends the new todo to the page
      $.ajax(requestConfig).then(function (responseMessage) {
          // console.log(responseMessage);
          if(responseMessage == 'added'){
            document.getElementById("review_added").innerHTML += `<p class="reviewAdded-success"> Review succesfully added! </p>`
            document.getElementById("current_added_reviews").innerHTML += `<li>Rating: ${rating}<br>Comment: ${comment}</li>`;
        }
        // else if(responseMessage.success === false){
        // document.getElementById("review_added").innerHTML = `<p class="reviewAdded-fail"> ${responseMessage.error} </p>` }
        else{
            // console.log(responseMessage);
        document.getElementById("review_added").innerHTML = `<p class="reviewAdded-fail"> ${responseMessage} </p>` }
        //document.getElementById("current_added_reviews").innerHTML += `<li>Rating: ${rating}<br>Comment: ${comment}</li>`;
      });
    }
})
}
const add_file_button = document.getElementById("add_file_button");
if(add_file_button){
add_file_button.addEventListener("click",(event)=>{
    event.preventDefault();
    $("#uploadFile").after(`<br><br><input type='file' id='uploadFile' name='uploadFile' accept="image/*">`)
}) }

const update_user = document.getElementById('profile_update_form');
if (update_user) {
  update_user.addEventListener('submit',(event) => {
      event.preventDefault();

      const firstNameUpdate = document.getElementById('firstname_update').value;
      const lastNameUpdate = document.getElementById('lastname_update').value;
      const phoneNoUpdate = document.getElementById('phoneno_update').value;

      try {
        if(firstNameUpdate === undefined || lastNameUpdate === undefined || phoneNoUpdate === undefined){ throw "One or more argument is missing"; }
        checkString(firstNameUpdate,"First Name");
        checkString(lastNameUpdate,"Last name");
        checkPhoneNumber(phoneNoUpdate,"Phone number")
        update_user.submit();
      } catch (error) {
          document.getElementById("error_js").innerHTML = error;
      }
})
}


const whatsappBtn = document.querySelector(".whatsapp-btn");
if(whatsappBtn){
let postUrl = encodeURI(document.location.href);
let postTitle = encodeURI("Check out this listing");
whatsappBtn.setAttribute("href",`https://api.whatsapp.com/send?text=${postTitle} ${postUrl}`) }

function searchListingPage(){
    let input = document.getElementById("searchListing").value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName("homepageListings");
    
    for (let i = 0; i < x.length; i++) {
        if(!x[i].innerHTML.toLowerCase().includes(input)){
            x[i].style.display = "none";
        }
        else{
            x[i].style.display = "list-item";
        }
    }
}

function filter(){
    var filterSelect = document.getElementById('filterSelect').value;
    var filterError = document.getElementById('filterError');
    filterError.innerHTML = "";
    var from = document.getElementById('filterFrom').value;
    var to = document.getElementById('filterTo').value;
    let x = document.getElementsByClassName("homepageListings");
    try {
        if(filterSelect === "price"){
            from = checkPrice(from,"Price from");
            to = checkPrice(to,"Price to");
            if(from > to) throw "Price range selected is not correct";
            var listingPrice = document.getElementsByClassName("listingPrice");
            for (let i = 0; i < x.length; i++) {
                if(listingPrice[i].innerHTML > to || listingPrice[i].innerHTML < from){
                    x[i].style.display = "none";
                }
                else{
                    x[i].style.display = "list-item";
                }
            }
        }
        else if(filterSelect === "volume"){
            from = checkVolume(from,"Volume from");
            to = checkVolume(to,"Volume to");
            if(from > to) throw "Volume range selected is not correct";
            var listingVolume = document.getElementsByClassName("listingVolume");
            for (let i = 0; i < x.length; i++) {
                if(listingVolume[i].innerHTML > to || listingVolume[i].innerHTML < from){
                    x[i].style.display = "none";
                }
                else{
                    x[i].style.display = "list-item";
                }
            }
        }
        else if (filterSelect === "availability") {
            from = new Date(checkDate(from,"Available from date"));
            to = new Date(checkDate(to,"Available to date"));
            if(from > to) throw "available range selected is not correct";
            var listingAvailableStartDate = document.getElementsByClassName("listingAvailableStartInput");
            var listingAvailableEndDate = document.getElementsByClassName("listingAvailableEndInput");
            for (let i = 0; i < x.length; i++) {
                let listingTo = new Date(listingAvailableEndDate[i].innerHTML)
                let listingFrom = new Date(listingAvailableStartDate[i].innerHTML)
                if(listingTo < to || listingFrom > from){
                    x[i].style.display = "none";
                }
                else{
                    x[i].style.display = "list-item";
                }
            }
        } else {
            filterError.innerHTML = "Please select a field";
        }
    } catch (error) {
        filterError.innerHTML = error;
    }
}

function resetFilter(){
    let x = document.getElementsByClassName("homepageListings");
    for (let i = 0; i < x.length; i++) {
        x[i].style.display = "list-item";
    }
    filterError.innerHTML = "";
}

const addSponsorPay = document.getElementById("addSponsorPay-form");
if(addSponsorPay){
    addSponsorPay.addEventListener("submit",(event)=>{
        event.preventDefault();
        var boostamount = document.getElementById("sponsorPayInput").value;
        try{
        boostamount = checkSponsorPrice(boostamount,"boost price");
        addSponsorPay.submit();
        }
        catch(e){
            document.getElementById("error_js").innerHTML = e;
        }
    })
}

const addCommentsForm = document.getElementById("comment_question_input_form")
if(addCommentsForm){
    addCommentsForm.addEventListener("submit",(event)=>{
        event.preventDefault();
        var commentInput = document.getElementById("comment_question_input").value;
        try{
        commentInput = checkString(commentInput,"Comment Input");
        addCommentsForm.submit();
        }
        catch(e){
            document.getElementById("error_js").innerHTML = e;
        }
    })
}

const show_chat = document.getElementsByClassName("show_chat_button")
const hide_chat = document.getElementsByClassName("hide_chat_button")
const chat = document.getElementsByClassName("hide_chat_div")
// console.log(show_chat)
// console.log(chat)
for (let i = 0; i < hide_chat.length; i++) {
        chat[i].style.display = "none";
}
for (let i = 0; i < hide_chat.length; i++) {
    hide_chat[i].addEventListener("click",(event)=>{
        chat[i].style.display = "none";
    })
}
for (let i = 0; i < show_chat.length; i++) {
    show_chat[i].addEventListener("click",(event)=>{
        chat[i].style.display = "block";
    })
}

const message_form = document.getElementById("new_message_form")
if(message_form){
    message_form.addEventListener("submit",(event)=>{
        event.preventDefault();
        try {
            var messagestring = checkString(document.getElementById("new_messageInput").value,"Message string");
            message_form.submit();
        } catch (error) {
            document.getElementById("error_js_message").innerHTML = error; 
        }
    })
}

// ***********************************************************
// ***************  HELPER FUNCTIONS  ************************
// ***********************************************************

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

function checkSponsorPrice(price, varName) {
    if (!price) throw `Error: You must provide a ${varName}`
    if (price.toString().trim() == '') throw `Error: You must provide a ${varName}`
    price = Number(price)
    if (isNaN(price) == true) throw `Error: ${varName} must be a number`
    if (price < -1) throw `Error: ${varName} should be greater than or equal to 0`
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

  function checkVolume(volume, varName) {
    if (!volume) throw `Error: You must provide a ${varName}`
    if (volume.trim() == '') throw `Error: You must provide a ${varName}`
    volume = Number(volume)
    if (isNaN(volume) == true) throw `Error: ${varName} must be a number`
    if (volume <= 0) throw `Error: ${varName} should be greater than 0`
    if (volume > 1000000) throw `Error: ${varName} should be lesser than 100`
    return volume
  }

function checkRating(rating, varName) {
    if (!rating) throw `Error: You must provide a ${varName}`
    if (rating.trim() == '') throw `Error: You must provide a ${varName}`
    rating = Number(rating)
    if (isNaN(dimension) == true) throw `Error: ${varName} must be a number`
    if (rating > 5 || rating < 0) throw `Error: ${varName} must be between 0 and 5`
    return rating
  }
  function checkRating(rating, varName) {
    if (rating === undefined) throw `Error: You must provide a ${varName}`
    if (rating.toString().trim() == '') throw `Error: You must provide a ${varName}`
    rating = Number(rating)
    if (isNaN(rating) == true) throw `Error: ${varName} must be a number`
    if (rating > 5 || rating < 0) throw `Error: ${varName} must be between 0 and 5`
    return rating
  }

  function checkLongitude(longitude, varName) {
    if (longitude === undefined) throw `Error: You must provide a ${varName}`
    if (longitude.toString().trim() == '') throw `Error: You must provide a ${varName}`
    longitude = Number(longitude)
    if (isNaN(longitude) == true) throw `Error: ${varName} must be a number`
    if (longitude > 180 || longitude < -180) throw `Error: ${varName} must be between -180 and 180`
    return longitude
  }

   function checkLatitude(latitude, varName) {
    if (latitude === undefined) throw `Error: You must provide a ${varName}`
    if (latitude.toString().trim() == '') throw `Error: You must provide a ${varName}`
    latitude = Number(latitude)
    if (isNaN(latitude) == true) throw `Error: ${varName} must be a number`
    if (latitude > 90 || latitude < -90) throw `Error: ${varName} must be between -90 and 90`
    return latitude
   }