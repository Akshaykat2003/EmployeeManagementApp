const BASE_URL = 'http://localhost:8080';

export const GetAllEmployees = async (search = '', page = 1, limit = 5) => {
    const url =
        `${BASE_URL}/api/employees?search=${search}&page=${page}&limit=${limit}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const result = await fetch(url, options);
        const { data } = await result.json();

        return data;
    } catch (err) {
        return err;
    }
}

export const GetEmployeeDetailsById = async (id) => {
    const url =
        `${BASE_URL}/api/employees/${id}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const result = await fetch(url, options);
        const { data } = await result.json();
        console.log(data);
        return data;
    } catch (err) {
        return err;
    }
}

export const DeleteEmployeeById = async (id) => {
    const url =
        `${BASE_URL}/api/employees/${id}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const result = await fetch(url, options);
        const data = await result.json();
        console.log(data);
        return data;
    } catch (err) {
        return err;
    }
}


export const CreateEmployee = async (empObj) => {
    const url = `${BASE_URL}/api/employees`;
    console.log('url ', url);

    const formData = new FormData();
    for (const key in empObj) {
        formData.append(key, empObj[key]);
    }

    const options = {
        method: 'POST',
        body: formData,
    };

    try {
        const result = await fetch(url, options);
        console.log('Response status:', result.status);  // Log the response status
        console.log('Response headers:', result.headers);  // Log the response headers

        const textResponse = await result.text();  // Get the response as text
        console.log('Raw response:', textResponse);  // Log the raw response

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status} - ${textResponse}`);
        }

        // Try to parse the result as JSON
        const data = JSON.parse(textResponse);
        return data;
    } catch (err) {
        console.error('Error in CreateEmployee:', err);
        return { success: false, message: err.message };
    }
};
export const UpdateEmployeeById = async (empObj, id) => {
    const url = `${BASE_URL}/api/employees/${id}`;
    console.log('url ', url);
    // Create a FormData object
    const formData = new FormData();

    // Append all fields to the FormData object
    for (const key in empObj) {
        formData.append(key, empObj[key]);
    }
    // FormData handles the headers and content type
    const options = {
        method: 'PUT',
        body: formData
    };
    try {
        const result = await fetch(url, options);
        const data = await result.json();
        console.log('<---update--> ', data);
        return data;
    } catch (err) {
        return err;
    }
};