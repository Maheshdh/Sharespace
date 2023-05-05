import { ObjectId } from "mongodb";

const exportedMethods = {
    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`
        if (typeof id !== 'string') throw `Error:${varName} must be a string`
        id = id.trim();
        if (id.length === 0) throw `Error: ${varName} cannot be an empty string or just spaces`
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
      },

    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`
        strVal = strVal.trim();
        if (strVal.length === 0)
          throw `Error: ${varName} cannot be an empty string or string with just spaces`
        if (!isNaN(strVal))
          throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
        return strVal;
      },

      checkEmail(mail, varName) {
        if (!mail) throw `Error: You must supply a ${varName}!`;
        if (typeof mail !== "string") throw `Error: ${varName} must be a string!`;
        mail = mail.trim().toLowerCase();

        let emailAddressRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (mail.match(emailAddressRegEx)) {
          return mail
        } else throw 'Error: Email Address should be of format: example@example.com'
      },

      checkList(list, varName) {
        if (list.length === 0) throw `Error List ${varName} should not be empty`
        // TODO: Check if elements inside list are not empty strings?
      },

      checkPassword(password, varName) {
        if (!password) throw `Error: You must supply a ${varName}!`;
        if (typeof password !== "string") throw `Error: ${varName} must be a string!`;
        if (password.trim().length === 0) throw `Error: ${varName} cannot be empty`;
        if (password.match(" ")) throw `Error: ${varName} cannot contain spaces`;

        let passwordRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/ //Must be betwwen 7-15 characters, 1 numer, 1 special
        if (password.match(passwordRegEx)) {
          return password 
        } else throw 'Error: Password must be between 7-15 characters with at least one numeric digit and a special character'
      },

      checkPhoneNumber (phone_no, varName) {
        // TODO: Use Google's libphonenumber library
        let phoneRegEx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        if (phone_no.match(phoneRegEx)) {
          return phone_no 
        } else throw `Error: ${varName} entered is not valid`
      },


      checkDate(date,varName){
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
      },
        

      checkPrice(price, varName) {
        if (!price) throw `Error: You must provide a ${varName}`
        if (price.trim() == '') throw `Error: You must provide a ${varName}`
        price = Number(price)
        if (isNaN(price) == true) throw `Error: ${varName} must be a number`
        if (price <= 0) throw `Error: ${varName} should be greater than 0`
        if (price > 1000000000) throw `Error: ${varName} should be lesser than 1,000,000,000`
        return price
      },

      checkSponsorPrice(price, varName) {
        if (!price) throw `Error: You must provide a ${varName}`
        if (price.toString().trim() == '') throw `Error: You must provide a ${varName}`
        price = Number(price)
        if (isNaN(price) == true) throw `Error: ${varName} must be a number`
        if (price <= 0) throw `Error: ${varName} should be greater than 0`
        if (price > 1000000000) throw `Error: ${varName} should be lesser than 1,000,000,000`
        return price
      },

      checkDimension(dimension, varName) {
        if (!dimension) throw `Error: You must provide a ${varName}`
        if (dimension.trim() == '') throw `Error: You must provide a ${varName}`
        dimension = Number(dimension)
        if (isNaN(dimension) == true) throw `Error: ${varName} must be a number`
        if (dimension <= 0) throw `Error: ${varName} should be greater than 0`
        if (dimension > 100) throw `Error: ${varName} should be lesser than 100`
        return dimension
      },

      checkRating(rating, varName) {
        if (rating === undefined) throw `Error: You must provide a ${varName}`
        if (rating.toString().trim() == '') throw `Error: You must provide a ${varName}`
        rating = Number(rating)
        if (isNaN(rating) == true) throw `Error: ${varName} must be a number`
        if (rating > 5 || rating < 0) throw `Error: ${varName} must be between 0 and 5`
        return rating
      }

}

export default exportedMethods