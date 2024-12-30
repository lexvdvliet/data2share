// list_current_plans.js
window.$memberstackDom.getCurrentMember().then((member) => {
  console.log(member); // Log member data
  if (member.data) {
    var currentPlan = document.querySelector('.current-plan'); // Use class selector
    const planConnections = member.data["planConnections"];
    
    console.log(planConnections); // Log plan connections
    
    if (planConnections && planConnections.length > 0) {
      // Start building the styled table with an additional Plan Name column
      let tableHTML = `
        <table class="plan-table">
          <thead>
            <tr>
              <th>Plan ID</th>
              <th>Plan Name</th> <!-- New column for Plan Name -->
              <th>Plan Type</th>
            </tr>
          </thead>
          <tbody>
      `;

      // Loop through each plan and add a row to the table
      planConnections.forEach(connection => {
        const planId = connection.planId; // The Plan ID
        const planType = connection.type || "Unnamed Plan"; // Use the type for display

        // Extract the plan name (part of the planId after 'pln_' but before '-')
        const planNameMatch = planId.match(/^pln_([^-]+)/);
        const planName = planNameMatch ? planNameMatch[1] : "Unknown";

        tableHTML += `
          <tr>
            <td>${planId}</td>
            <td>${planName}</td> <!-- Display extracted Plan Name -->
            <td>${planType}</td>
          </tr>
        `;
      });

      // Close the table tag
      tableHTML += `
          </tbody>
        </table>
      `;

      // Set the div content to the generated table
      currentPlan.innerHTML = tableHTML;

    } else {
      console.log('No plan connections');
      currentPlan.innerText = "No current plans found."; // Display a message if no plan connections are found
    }
  } else {
    window.location.href = '/login'; // Redirect to login if user is not logged in
  }
});