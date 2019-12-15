export const URI = 'https://native-todo-app-630d9.firebaseio.com/';

export class Api {

  static async post(url, body) {
    try {
      const response = await fetch(URI + url + '.json', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });
      return await response.json()
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async get(url) {
    try {
      const response = await fetch(URI + url + '.json', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async patch(url, params, body) {
    try {
      await fetch(`${URI + url}/${params.id}.json`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async put() {}

  static async delete(url, params) {
    try {
      await fetch(`${URI + url}/${params.id}.json`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      })
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
