document.addEventListener("DOMContentLoaded", () => {
    const mushrooms = document.querySelectorAll("#mushroom-container img");
    const popup = document.getElementById("popup");
    const popupCloseButton = document.getElementById("popup-close");
    const collectedCountDisplay = document.getElementById("collected-count");
    const totalCountDisplay = document.getElementById("total-count");
    const clockOverlay = document.getElementById("clock-overlay");
    const clockTime = document.getElementById("clock-time");
    const clockDate = document.getElementById("clock-date");
    const showClockButton = document.getElementById("show-clock");
    const focusImage = document.getElementById("focus-image");

    const changeFocusButton = document.getElementById("change-focus");


    // Settings Elements
    const settingsButton = document.getElementById("settings-button");
    const settingsPanel = document.getElementById("settings-panel");
    const manualTimeInput = document.getElementById("manual-time");
    const confirmTimeButton = document.getElementById("confirm-time");
    const setRealTimeButton = document.getElementById("set-real-time");
    const closeSettingsButton = document.getElementById("close-settings");

    let now = new Date();

    // Open Settings Panel
    settingsButton.addEventListener("click", () => {
        settingsPanel.classList.remove("hidden");
    });

    // Close Settings Panel
    closeSettingsButton.addEventListener("click", () => {
        settingsPanel.classList.add("hidden");
    });

    // Apply Custom Time
    confirmTimeButton.addEventListener("click", () => {
        const selectedTime = manualTimeInput.value;
        if (!selectedTime) {
            alert("Please enter a valid time.");
            return;
        }

        const [customHours, customMinutes] = selectedTime.split(":").map(Number);
        now.setHours(customHours, customMinutes);
        settingsPanel.classList.add("hidden");

        setFocusImage();
    });


    // Reset to Real Time
    setRealTimeButton.addEventListener("click", () => {
        manualTimeInput.value = ""; // clears input field
        now = new Date();
        settingsPanel.classList.add("hidden");
        setFocusImage();
    });



    const focusImages = {
        morning: [
            "https://lh3.googleusercontent.com/d/16Y8meE7FBiKQDSGisBD1kpMZFyxh_kWe",
            "https://lh3.googleusercontent.com/d/1WzgUZgJVOfC5wK8WbtXOoPXfa-pFGt6J",
            "https://lh3.googleusercontent.com/d/1UogWV-dy1Ll8OB_PQmG1j4TQdEs7lnW7"
        ],
        noon: [
            "https://lh3.googleusercontent.com/d/1RrAKGyhnco31hw2PpqQw4gwMhRofAlb4",
            "https://lh3.googleusercontent.com/d/1qVW_itLmjGKRzqEgtFIjyWiNRaXUO4Ng",
            "https://lh3.googleusercontent.com/d/1iQMaD0ob4u4-d0-GXszKGYYblInANHD4"
        ],
        afternoon: [
            "https://lh3.googleusercontent.com/d/16901YHbEfi3tmO3aetmizSuZBhzGhFI1",
            "https://lh3.googleusercontent.com/d/1wPkQAdkJIZbxZQS_UM_8Qi1ySJeaiLQP",
            "https://lh3.googleusercontent.com/d/1HoeKCP5QZuDdvuOQt4gZORaZor7VjeiE"
        ],
        evening: [
            "https://lh3.googleusercontent.com/d/1ByQZExswP6NQey4h7y8xK_-PPV9W4KjG",
            "https://lh3.googleusercontent.com/d/1jZBfgqmMKcwjTWCO2UwXvvV_YomG1Yrq",
            "https://lh3.googleusercontent.com/d/1VI7LU42obeE9O9W1jdaX--rD7dC6OZCR"
        ],
        night: [
            "https://lh3.googleusercontent.com/d/1leuS-UAKMbtRdULQR27JbGpkER8m22mL",
            "https://lh3.googleusercontent.com/d/1l-nrgp-h_VJljwcQarJv703XdWPFIzjG",
            "https://lh3.googleusercontent.com/d/12eGi43nV_1dnyP7p0thsuyd26fPwc4GB"
        ],
        dawn: [
            "https://lh3.googleusercontent.com/d/1aPtKOwnpJEQyIq3iH70UOW04kT_9fdWl",
            "https://lh3.googleusercontent.com/d/1cLFsAYEILZ21rZzYLq3z04Gzh4lZhmMZ",
            "https://lh3.googleusercontent.com/d/1nWInoUBjIdfAmieS-moBYcEGb9C5cnHR"
        ]
    };

    let currentSet = [];
    let currentIndex = 0;


    function getTimePeriod() {
        const hours = now.getHours();

        if (hours >= 6 && hours < 10) return "morning";
        if (hours >= 10 && hours < 14) return "noon";
        if (hours >= 14 && hours < 18) return "afternoon";
        if (hours >= 18 && hours < 22) return "evening";
        if (hours >= 22 || hours < 2) return "night";
        return "dawn"; // 2am - 6am
    }


    function setFocusImage() {
        const period = getTimePeriod();
        currentSet = focusImages[period];

        console.log(currentSet)

        if (currentIndex >= currentSet.length) {
            currentIndex = 0;
        }

        focusImage.src = currentSet[currentIndex];

        focusImage.onload = () => {
            getAverageBackgroundColor();
        };
    }

    changeFocusButton.addEventListener("click", () => {
        if (currentSet.length > 0) {
            currentIndex = (currentIndex + 1) % currentSet.length;
            setFocusImage();
        }
    });

    setFocusImage(); 

    //Mushroom
    let collected = 0;
    let total = mushrooms.length; // Total mushrooms
    totalCountDisplay.textContent = total; // Set total mushroom count

    let mushroomPositions = {}; 
    // Load positions from JSON file
    fetch("mushroom_positions.json")
        .then(response => response.json())
        .then(data => {
            mushroomPositions = data;
            setMushroomPositions(); // Apply positions when page loads
        })
        .catch(error => console.error("Error loading mushroom positions:", error));


    function setMushroomPositions() {
        const period = getTimePeriod(); // Get current time period
        const sceneKey = `scene${currentIndex}`;
    
        if (mushroomPositions[period] && mushroomPositions[period][sceneKey]) {
            mushroomPositions[period][sceneKey].forEach(pos => {
                const mushroom = document.getElementById(pos.id);

                console.log(mushroom)
                if (mushroom) {
                    mushroom.style.left = pos.left;
                    mushroom.style.top = pos.top;
                    mushroom.style.width = pos.width;
                } else {
                    mushroom.style.display = "none";
                }
            });
        } 
    }

    document.getElementById("change-focus").addEventListener("click", setMushroomPositions);



    // Ensure the overlays are hidden on page load
    popup.classList.add("hidden");
    clockOverlay.classList.add("hidden");

    // Click event for mushrooms
    mushrooms.forEach(mushroom => {
        mushroom.addEventListener("click", () => {
            collected++;
            collectedCountDisplay.textContent = collected;
            mushroom.style.display = "none"; // Hide the mushroom
            showPopup();
        });
    });


    popupCloseButton.addEventListener("click", closePopup);

    // Show the clock overlay when button is clicked
    showClockButton.addEventListener("click", () => {
        updateClock(); // Ensure time updates immediately
        clockOverlay.classList.remove("hidden");

        getAverageBackgroundColor();
    });

    // Close clock overlay when clicking on it
    clockOverlay.addEventListener("click", () => {
        clockOverlay.classList.add("hidden");
    });

    // Function to update the clock
    function updateClock() {
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        clockTime.textContent = `${hours}:${minutes}`;
        clockDate.textContent = dateStr;
    }

    // Update the clock every second
    setInterval(updateClock, 1000);

    function showPopup() {
        popup.classList.remove("hidden");
    }

    function closePopup() {
        popup.classList.add("hidden");
    }



    function getAverageBackgroundColor() {
        const canvas = document.getElementById("color-analyzer");
        const ctx = canvas.getContext("2d");

        // Ensure the image has loaded before processing
        if (!focusImage.complete) {
            focusImage.onload = getAverageBackgroundColor;
        }

        // Resize canvas to be a small sample of the image (faster processing)
        canvas.width = 50;  // Downsample to 50x50 pixels
        canvas.height = 50;
        ctx.drawImage(focusImage, 0, 0, canvas.width, canvas.height);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let totalPixels = pixels.length / 4;

        let sumR = 0, sumG = 0, sumB = 0;

        // Iterate through every pixel
        for (let i = 0; i < pixels.length; i += 4) {
            sumR += pixels[i];      
            sumG += pixels[i + 1];  
            sumB += pixels[i + 2];  
        }

        const factor = 0.7;
        const avgR = Math.round(sumR / totalPixels) * factor;
        const avgG = Math.round(sumG / totalPixels) * factor;
        const avgB = Math.round(sumB / totalPixels) * factor;
        const averageColor = `rgb(${avgR}, ${avgG}, ${avgB})`;

        clockTime.style.color = averageColor;
        clockDate.style.color = averageColor;
    }
});
