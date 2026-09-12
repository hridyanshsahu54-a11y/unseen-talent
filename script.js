// Open showcase popup
function openShowcase() {
    document.getElementById("showcaseModal").style.display = "grid";
}


// Close showcase popup
function closeShowcase() {
    document.getElementById("showcaseModal").style.display = "none";
}


// Demo submit
function submitShowcase() {

    alert(
        "Your showcase is ready! 🚀\n\n" +
        "This is a prototype. In the full version, your project would be submitted for discovery."
    );

    closeShowcase();
}


// Close popup when clicking outside the box
window.addEventListener("click", function(event) {

    const modal = document.getElementById("showcaseModal");

    if (event.target === modal) {
        closeShowcase();
    }

});