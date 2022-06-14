function validateForm() {
    alert("validateForm3");
    try {
        
        var name = document.forms["register"]["username"].value;
        var password = document.forms["register"]["password"].value;
    var confirmPassword = document.forms["register"]["confirmPassword"].value;
    alert("name: " + name + " password: " + password + " confirmPassword: " + confirmPassword);
    
    var regEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;  //Javascript reGex for Email Validation.
    var regPhone=/^\d{10}$/;                                        // Javascript reGex for Phone Number validation.
    var regName = /\d+$/g;                                    // Javascript reGex for Name validation

    if (name == "" || regName.test(name)) {
        window.alert("Please enter your name properly.");
        name.focus();
        return false;
    }
    
    // if (address == "") {
        //     window.alert("Please enter your address.");
        //     address.focus();
        //     return false;
        // }
        
        // if (email == "" || !regEmail.test(email)) {
            //     window.alert("Please enter a valid e-mail address.");
            //     email.focus();
            //     return false;
            // }
            
            if (password == "") {
                alert("Please enter your password");
                password.focus();
                return false;
            }
            
            if(password.length <6){
                alert("Password should be atleast 6 character long");
                password.focus();
                return false;
                
            }
            
            if (password_confirmation == "") {
                alert("Please enter your password again");
                password_confirmation.focus();
                return false;
            }
            
            if (password != confirmPassword) {
                alert("Passwords do not match");
                confirmPassword.focus();
                return false;
            }
            // if (phone == "" || !regPhone.test(phone)) {
                //     alert("Please enter valid phone number.");
                //     phone.focus();
                //     return false;
                // }
                
                // if (what.selectedIndex == -1) {
                    //     alert("Please enter your course.");
                    //     what.focus();
                    //     return false;
                    // }
                    
                    return true;
                } catch (error) {
                    alert(error);

                }
                }

                function validateFormNeu() {
                    let name = document.forms["registerForm"]["username"].value;
                    let pwd = document.forms["registerForm"]["password"].value;
                    let pwd2 = document.forms["registerForm"]["pwd2"].value;
                    if (name == "") {
                      alert("Name must be filled out");
                      return false;
                    }
                    if (pwd == "") {
                        alert("Password must be filled out");
                        return false;
                        }
                        if (pwd2 == "") {
                            alert("Password Confirm must be filled out");
                            return false;
                            }
                            if (pwd != pwd2) {
                                alert("Passwords do not match");
                                return false;
                                }
                                return true;


                  }