function validateForm() {
	var name = document.forms["register"]["name"].value;
	var email = document.forms["register"]["email"].value;
	var atpos = email.indexOf("@");
	var dotpos = email.lastIndexOf(".");
	
	if(name == "" || name == null) {
		alert("No name entered. Please review your form.");
		return false;
	}
	
	if(email == "" || email == null) {
		alert("No email entered. Please review your form.");
		return false;
	}
	
	if(atpos == -1 || dotpos == -1 || atpos > dotpos) {
		alert("The email entered is not valid. Please review your form.");
		return false;
	}
	
	return true;
}