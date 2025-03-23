document.addEventListener("DOMContentLoaded", async () => {
  const allPlansDiv = document.querySelector('.all-plans');
  const currentAccounts = myMSALObj.getAllAccounts();

  if (currentAccounts.length > 0) {
      const currentAccounts = myMSALObj.getAllAccounts();
  
      function waitForElement(selector, callback, interval = 100) {
          const checkExist = setInterval(() => {
              const element = document.querySelector(selector);
              if (element) {
                  clearInterval(checkExist);
                  callback(element);
              }
          }, interval);
      }
  
      waitForElement('#w-tabs-0-data-w-tab-2', (allPlansTab) => {
          allPlansTab.remove();
      });
  return;
  }

  try {
      const allPlansResponse = await window.$memberstackDom.getPlans();
      const allPlans = allPlansResponse?.data || [];

      const memberResponse = await window.$memberstackDom.getCurrentMember();
      const memberData = memberResponse?.data;
      const assignedPlans = memberData?.planConnections?.map(connection => connection.planId) || [];

      console.log("Fetched plans:", allPlans);
      console.log("Assigned plans:", assignedPlans);

      if (allPlans.length > 0) {
          let tableHTML = `
              <table class="plan-table">
                  <thead>
                      <tr>
                          <th>Rol ID</th>
                          <th>Rol naam</th>
                          <th>Beschrijving</th>
                          <th>Actie</th>
                      </tr>
                  </thead>
                  <tbody>
          `;

          allPlans.forEach(plan => {
              const planId = plan.id;
              const planName = plan.name;
              const planDescription = plan.description || "No description available";

              const isAssigned = assignedPlans.includes(planId);
              const buttonDisabled = isAssigned ? 'disabled' : '';
              const buttonStyle = isAssigned ? 'background-color: grey; color: white; cursor: not-allowed;' : '';

              tableHTML += `
                  <tr>
                      <td class="plan-id">${planId}</td>
                      <td class="plan-name">${planName}</td>
                      <td class="plan-description">${planDescription}</td>
                      <td>
                          <button class="request-plan" data-plan-id="${planId}" data-plan-name="${planName}" ${buttonDisabled} style="${buttonStyle}">
                              ${isAssigned ? 'Toegewezen' : 'Aanvragen'}
                          </button>
                      </td>
                  </tr>
              `;
          });

          tableHTML += `</tbody></table>`;
          if (allPlansDiv) {
              allPlansDiv.innerHTML = tableHTML;
          }

          const requestButtons = document.querySelectorAll('.request-plan');
          requestButtons.forEach(button => {
              button.addEventListener('click', async (event) => {
                  if (button.disabled) return;

                  const row = event.target.closest('tr');
                  const planId = row.querySelector('.plan-id').innerText;
                  const planName = row.querySelector('.plan-name').innerText;
                  const planDescription = row.querySelector('.plan-description').innerText;

                  const userEmail = memberData.auth.email;

                  fetch('https://hook.eu2.make.com/2efcthvwakasnrmohbujx7b99sp5ioid', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ planId, planName, planDescription, userEmail })
                  })
                  .then(response => {
                      if (response.ok) {
                          alert(`Plan request sent for ${planName}`);
                      } else {
                          alert('There was an error sending the request.');
                      }
                  })
                  .catch(error => {
                      console.error('Error during plan request:', error);
                      alert('There was an error sending the request.');
                  });
              });
          });

      } else {
          if (allPlansDiv) {
              allPlansDiv.innerText = "No plans available.";
          }
      }
  } catch (error) {
      console.error("Error fetching plans or member data:", error);
      if (allPlansDiv) {
          allPlansDiv.innerText = "An error occurred while fetching plans.";
      }
  }
});