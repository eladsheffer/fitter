
//const baseUrl = 'https://fitter-backend.onrender.com/';

const getAuthToken = () => {
    // Retrieve the authentication token from wherever you have stored it
    let x = localStorage.getItem('authToken');
    console.log(x);
    return localStorage.getItem('authToken');
};

const getData = async (url) => {

    try {
        const response = await fetch(url);
        // const response = await fetch(url, {
        //     headers: {
        //         'Authorization': `Bearer ${getAuthToken()}`
        //     }
        // });
        const data = await response.json();
        const status = response.status;
        console.log(data);
        if (status === 200)
            return data;
        return null;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
        //throw error;
        // handle the error here
    }
};

const postData = async (url, data, login = false) => {
    const headers = {
        Accept: 'application/json',
    };

    // Include the Authorization header only if login is true
    if (!login) {
        headers['Authorization'] = `Token ${getAuthToken()}`;
    }
    
    if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        data = JSON.stringify(data);
    }

    const settings = {
        method: 'POST',
        headers: headers,
        body: data
    };
    
    try {
        const response = await fetch(url, settings);
        const responseData = await response.json();
        const status = response.status;

        // Store auth token only if it's present in the response
        if (responseData.token) {
            localStorage.setItem('authToken', responseData.token);
        }

        if (status === 200 || status === 201) {
            console.log("API SERVICE - SUCCESS: ", responseData);
            return responseData;
        }

        console.log("API SERVICE - FAILED: ", responseData);

        return null;
    } catch (error) {
        console.error('Error posting data:', error);
        return null;
        //throw error;
        // handle the error here
    }
};

const patchData = async (url, data, login = false) => {

    const headers = {
        Accept: 'application/json',
    };

    if (!login) {
        headers['Authorization'] = `Token ${getAuthToken()}`;
    }

    if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        data = JSON.stringify(data);
    }

    const settings = {
        method: 'PATCH',
        headers: headers,
        body: data
    };

    try {
        const response = await fetch(url, settings);
        const responseData = await response.json();
        const status = response.status;
        if (status === 200)
            return responseData;

        console.log("API SERVICE - FAILED: ", responseData);

        
        return null;
    } catch (error) {
        console.error('Error updating data:', error);
        return null;
        //throw error;
        // handle the error here
    }
}


const putData = async (url, data, login = false) => {
    const headers = {
        Accept: 'application/json',
    };

    if (!login) {
        headers['Authorization'] = `Token ${getAuthToken()}`;
    }

    if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        data = JSON.stringify(data);
    }

    const settings = {
        method: 'PUT',
        headers: headers,
        body: data
    };

    try {
        const response = await fetch(url, settings);
        const responseData = await response.json();
        const status = response.status;
        if (status === 200)
            return responseData;

        console.log("API SERVICE - FAILED: ", responseData);

        
        return null;
    } catch (error) {
        console.error('Error updating data:', error);
        return null;
        //throw error;
        // handle the error here
    }
};

const deleteData = async (url) => {

    const headers = {
        Accept: 'application/json',
        'Authorization': `Token ${getAuthToken()}`
    };

    const settings = {
        method: 'DELETE',
        headers: headers
    };

    try {
        const response = await fetch(url, settings);
        const status = response.status;
        if (status === 200)
            return true;
        console.log("API SERVICE - FAILED: ", response);
        return false;
    } catch (error) {
        console.error('Error deleting data:', error);
        return null;
        //throw error;
        // handle the error here
    }
};

const formatDate = (date)=> {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  function formatFriendlyDate(isoDateString, options="") {
    // Creating a date object from the ISO string
    const date = new Date(isoDateString);

    // Converting to a more readable format
    const friendlyDate = date.toLocaleString("en-GB", {
      weekday: "long", // long name of the day
      year: "numeric", // numeric year
      month: "2-digit", // two digit month
      day: "2-digit", // two digit day
    });

    if (options.includes("time")) {
      // Adding the time to the friendly date
      const time = date.toLocaleString("en-GB", {
        hour: "2-digit", // two digit hour
        minute: "2-digit", // two digit minute
      });

      return `${friendlyDate} at ${time}`;
    }


    return friendlyDate;
  }

export { postData, putData, patchData, deleteData, getData, formatDate, haversineDistance, formatFriendlyDate };