document.addEventListener('DOMContentLoaded', () => {
  // Attach a click event listener to the upload button dynamically
  document.body.addEventListener('click', async (event) => {
    if (event.target.matches('button[id$="uploadButton"]')) {
      const uploadButton = event.target;

      // Dynamically determine the selected tab and associated elements
      const selectedTab = document.querySelector('[aria-selected="true"]');
      if (!selectedTab) {
        console.error('No tab is currently selected.');
        return;
      }

      const selectedTabName = selectedTab.getAttribute('data-w-tab');
      console.log(`Selected tab name: ${selectedTabName}`);

      // Dynamically fetch associated elements based on the tab name
      const elements = {
        fileInput: document.getElementById(`${selectedTabName}fileInput`),
        status: document.getElementById(`${selectedTabName}status`),
        imageUrl: document.getElementById(`${selectedTabName}imageUrl`),
        imageUpload: document.getElementById(`${selectedTabName}imageUpload`),
      };

      // Validate if all elements are found
      if (!elements.fileInput || !elements.status || !elements.imageUrl || !elements.imageUpload) {
        console.error('One or more elements are missing for the current tab.');
        return;
      }

      const { fileInput, status, imageUrl, imageUpload } = elements;

      // Validate file selection
      const file = fileInput.files[0];
      if (!file) {
        status.textContent = "Please select a file.";
        return;
      }

      // Validate file type
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedImageTypes.includes(file.type)) {
        status.textContent = "Please select a valid image file (JPEG, PNG, GIF, or WEBP).";
        return;
      }

      try {
        status.textContent = "Fetching SAS token...";

        // Fetch SAS token
        const response = await fetch(
          "https://datatosharefunctions.azurewebsites.net/api/addBlobImage?code=ghWdSVrNXmeOMgrOu85nZ07uyb58KHCDYvthI8YaBIvYAzFuztt1HA%3D%3D",
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch SAS token: ${response.statusText}`);
        }

        const { sasToken } = await response.json();

        // Construct Blob URL with SAS token
        const accountName = "datatoshare";
        const containerName = "images";
        const sanitizedFileName = file.name.replace(/ /g, "_");
        const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${sanitizedFileName}?${sasToken}`;
        const blobImageUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${sanitizedFileName}`;

        // Upload file to Azure Blob Storage
        status.textContent = "Uploading file...";
        const uploadResponse = await fetch(blobUrl, {
          method: "PUT",
          headers: { "x-ms-blob-type": "BlockBlob" },
          body: file,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        status.textContent = "File uploaded successfully.";
        imageUrl.textContent = blobImageUrl;
        imageUpload.src = blobImageUrl;
      } catch (error) {
        status.textContent = `Error during upload: ${error.message}`;
        console.error("Error during upload:", error.message);
      }
    }
  });
});