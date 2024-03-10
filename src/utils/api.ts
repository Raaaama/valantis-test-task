import axios from "axios";
import MD5 from 'crypto-js/md5';

export const request = async (action: string, params: any): Promise<any> => { 
  const requestData = typeof params === 'string' ? JSON.parse(params) : params;
  
  function generateXAuth() {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const authString = "Valantis" + "_" + timestamp;
    const xAuth = MD5(authString).toString();
    return xAuth;
  }

  const headers = {
    "X-Auth": generateXAuth(),
  };

  try {
    const response = await axios.post(
      "http://api.valantis.store:40000/",
      {
        action: action,
        params: requestData,
      },
      { headers: headers }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return request(action, params);
  }
};


export const getItemsByIds = async (ids: string[]) => {
  try {
    const data = await request("get_items", { ids });
    return data.result || [];
  } catch (e) {
    console.error("Error getting items:", e);
    throw e;
  }
};