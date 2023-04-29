
const exportedMethods = {
    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`
        if (typeof id !== 'string') throw `Error:${varName} must be a string`
        id = id.trim();
        if (id.length === 0) throw `Error: ${varName} cannot be an empty string or just spaces`
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

      checkPrice(price, varName) {
        if (!price) throw `Error: You must provide a ${varName}`
        if (price.trim() == '') throw `Error: You must provide a ${varName}`
        if (isNaN(price) == true) throw `Error: ${varName} must be a number`
        price = Number(price)
        if (price <= 0) throw `Error: ${varName} should be greater than 0`
        if (price > 1000000000) throw `Error: ${varName} should be lesser than 1,000,000,000`

        return price
      },

      checkDimension(dimension, varName) {
        if (!dimension) throw `Error: You must provide a ${varName}`
        if (dimension.trim() == '') throw `Error: You must provide a ${varName}`
        if (isNaN(dimension) == true) throw `Error: ${varName} must be a number`
        dimension = Number(dimension)
        if (dimension <= 0) throw `Error: ${varName} should be greater than 0`
        if (dimension > 100) throw `Error: ${varName} should be lesser than 100`
        return dimension
      }


}

export default exportedMethods