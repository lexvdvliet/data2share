document.addEventListener("DOMContentLoaded", function() {
    // Create an object to store the logged information
    const logInfo = {
        dateTime: new Date().toLocaleString(),     // Current datetime
        pageUrl: window.location.href,             // Current page URL
        userAgent: navigator.userAgent,            // Full user agent string
        browserInfo: `${navigator.appName} ${navigator.appVersion}`, // Browser name and version
        osInfo: navigator.platform                // Operating system/platform
    };

    // Log the entire object
    console.log("Page Load Information:", logInfo);

    // (Optional) Send this information to a backend server
    // fetch("https://your-server.com/log", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(logInfo)
    // }).catch(error => console.error("Error logging page load info:", error));
});

// appAndMemberData = await window.$memberstackDom.getAppAndMember()
// appAndMemberData.data.app
// appAndMemberData.data.member

// appAndMemberData.data.member.customFields["dark-mode-on"]
// if = true then dark mode, else light mode