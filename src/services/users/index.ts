import { UsersListFakeService } from "./fake";
import { UsersListApiService } from "./api";
import { UsersListService } from "./interface";

let service: UsersListService = new UsersListApiService();

if (process.env.REACT_APP_FAKE_API_MODE === "true") {
  service = new UsersListFakeService(1000, 0) as unknown as UsersListService;
}

export default service;

