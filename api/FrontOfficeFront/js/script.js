//For displaying the user nav dropdown for mobile
document.getElementById("userNavigationMobileDropDownMenu").style.display = "none";
function toggleDropdown() {
	var x = document.getElementById("userNavigationMobileDropDownMenu");
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn') && !e.target.matches('.dropglyph')) {
    document.getElementById("userNavigationMobileDropDownMenu").style.display = "none";
  }
}