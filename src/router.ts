import { Handler, Item, Router } from './types.ts';
import { Utils } from './utils.ts';
import { validate as uuidValidate } from 'uuid';
import { DatabaseMethods } from './database.ts';

export class RouterMethods {
  static routes: Router = {
    '/users': {
      POST: async (req, res) => {
        const data = await Utils.parseJSONBody<Item>(req);
        if (!data) {
          return Utils.sendResponse(res, 400, { error: 'User fields are required' });
        }
        if (!data?.username) {
          return Utils.sendResponse(res, 400, { error: 'Username is required' });
        } else if (!data?.age) {
          return Utils.sendResponse(res, 400, { error: 'Age is required' });
        } else if (!data?.hobbies) {
          return Utils.sendResponse(res, 400, { error: 'Hobbies is required' });
        }
        const newItem = DatabaseMethods.createItem(data);
        Utils.sendResponse(res, 201, newItem);
      },
      GET: (_, res) => {
        const items = DatabaseMethods.getAllItems();
        Utils.sendResponse(res, 200, items);
      },
    },
    '/users/:id': {
      GET: (_, res, params) => {
        if (params) {
          if (!uuidValidate(params.id)) {
            return Utils.sendResponse(res, 400, { error: 'Invalid User ID' });
          }
          const user = DatabaseMethods.getItem(params.id);
          if (!user) {
            return Utils.sendResponse(res, 404, { error: "User doesn't exist" });
          }
          Utils.sendResponse(res, 200, user);
        }
      },
      PUT: async (req, res, params) => {
        const data = await Utils.parseJSONBody<Partial<Item>>(req);

        if (params && data) {
          if (!uuidValidate(params.id)) {
            return Utils.sendResponse(res, 400, { error: 'Invalid User ID' });
          }

          const updatedUser = DatabaseMethods.updateItem(params.id, data);
          if (!updatedUser) {
            return Utils.sendResponse(res, 404, { error: "User doesn't exist" });
          }
          Utils.sendResponse(res, 200, updatedUser);
        }
      },
      DELETE: (_, res, params) => {
        if (params) {
          if (!uuidValidate(params.id)) {
            return Utils.sendResponse(res, 400, { error: 'Invalid User ID' });
          }
          const success = DatabaseMethods.deleteItem(params!.id);
          if (!success) {
            return Utils.sendResponse(res, 404, { error: "User doesn't exist" });
          }
          Utils.sendResponse(res, 204);
        }
      },
    },
  };

  static findRouteHandler = (
    method: string,
    path: string,
  ): { handler: Handler; params: Record<string, string> } | null => {
    for (const [routePath, route] of Object.entries(this.routes)) {
      const params = Utils.parseUrlParams(path, routePath);
      if (params !== null && route[method]) {
        return { handler: route[method], params };
      }
    }
    return null;
  };
}
