
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

const postData = async (url, data) => {

    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(url, settings);
        const data = await response.json();
        const status = response.status;
        localStorage.setItem('authToken', data.token);
        console.log("api: ",data);
        if (status === 200 || status === 201)
            return data;
        return null;
    } catch (error) {
        console.error('Error posting data:', error);
        return null;
        //throw error;
        // handle the error here
    }
};

const putData = async (url, data) => {
    const settings = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(url, settings);
        const data = await response.json();
        const status = response.status;
        if (status === 200)
            return data;
        return null;
    } catch (error) {
        console.error('Error updating data:', error);
        return null;
        //throw error;
        // handle the error here
    }
};

const deleteData = async (url) => {

    const settings = {
        method: 'DELETE',
    };

    try {
        const response = await fetch(url, settings);
        const status = response.status;
        if (status === 200)
            return true;
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

export { postData, putData, deleteData, getData, formatDate };