let dark_mode = document.getElementById("dark");

dark_mode.addEventListener("click", () => {
    if (dark.checked) {
        //code for light mode
        document.documentElement.style.setProperty("--bgcolor", "#ffffff");
        document.documentElement.style.setProperty("--navcolor", "#41cf5a");
        document.documentElement.style.setProperty("--bg2color", "#fffff2");
        document.documentElement.style.setProperty("--fontcolor", "rgb(27, 27, 27)");
        document.documentElement.style.setProperty("--shadow", "rgba(60, 60, 60, 0.5)");
    } else {
        //for dark mode 
        document.documentElement.style.setProperty("--bgcolor", "#101010");
        document.documentElement.style.setProperty("--navcolor", "#03C988");
        document.documentElement.style.setProperty("--bg2color", "#212121");
        document.documentElement.style.setProperty("--fontcolor", "rgb(194, 247, 255)");
        document.documentElement.style.setProperty("--shadow", "rgb(147 147 147 / 50%)");
    }
});