window.onload = () => {
    const accountMenu = document.getElementById("account");
    const dropdown = document.getElementById("account-menu");
    let timeoutId;

    // Function to show the dropdown menu
    const showDropdown = () => {
        clearTimeout(timeoutId);
        dropdown.style.display = "flex";
    };

    // Function to hide the dropdown menu after a delay
        const hideDropdown = () => {
        timeoutId = setTimeout(() => {
            dropdown.style.display = "none";
        }, 200);
    };

    // Show dropdown menu on mouse enter
    accountMenu.onmouseenter = () => {
        showDropdown();
    };

    // Hide dropdown menu on mouse leave from both button and dropdown
    accountMenu.onmouseleave = dropdown.onmouseleave = () => {
        hideDropdown();
    };

    // Cancel hiding dropdown if cursor enters the dropdown again
    dropdown.onmouseenter = () => {
        clearTimeout(timeoutId);
    };

    // Hide dropdown menu when cursor leaves the dropdown
    dropdown.onmouseleave = () => {
        hideDropdown();
    };
    // clcking on displaying cart
        
    
    

};


// Get the current time
var now = new Date().getTime();

// Set countDate to be 12 hours ahead of the current time
var countDate = now + (24 * 60 * 60 * 1000); // 12 hours * 60 minutes * 60 seconds * 1000 milliseconds

// Update the timer every second
var x = setInterval(function(){
    // Get the current time
    var now = new Date().getTime();
    
    // Calculate the time difference
    var distance = countDate - now;
    
    // Calculate hours, minutes, and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update the HTML elements with the calculated values
    document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');
    
    // If the countdown is over, display "00" for hours, minutes, and seconds
    if (distance <= 0) {
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";
        clearInterval(x); // Stop the countdown
    }
}, 1000
); // Update the timer every 1 second (1000 milliseconds)

