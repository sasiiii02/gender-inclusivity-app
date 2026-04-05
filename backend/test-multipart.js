import axios from "axios";
import FormData from "form-data";

async function runTest() {
  try {
    const form = new FormData();
    form.append("title", "Test Title");
    form.append("description", "Test Description");
    form.append("category", "General");
    form.append("level", "Beginner");
    form.append("duration", "60");

    // Assuming we need auth, but let's see if we get 'Unauthorized' or 'Validation error'
    // Actually, we need a valid token to reach the controller!
    console.log("Sending request to http://localhost:5000/api/courses");
    const res = await axios.post("http://localhost:5000/api/courses", form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log("Response:", res.data);
  } catch (error) {
    if (error.response) {
      console.log("Error status:", error.response.status);
      console.log("Error data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
}

runTest();
