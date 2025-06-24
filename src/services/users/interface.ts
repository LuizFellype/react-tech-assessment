import { AuthedService } from "services/base/authedService";
import { PaginatedSkipLimitResult } from "services/base/interface";
import { UserProfileData } from "services/userProfile/interface";


// User data type from the dummy API
export type RawUserData = {
  id: number,
  image: string,
  email: string,
  firstName: string,
  lastName: string,
  username: string,
  [key: string]: any
}

export abstract class UsersListService extends AuthedService {
  static apiUrl: string = `${process.env.REACT_APP_DUMMY_API_URL}`;

  protected buildEndpoint = (endpoint: string) => {
    const host = `${UsersListService.apiUrl}/`;
    const path = endpoint.replaceAll("//", "/");

    return `${host}${path}`;
  };

  abstract getAll(page?: number, limit?: number): Promise<PaginatedSkipLimitResult<UserProfileData>>;
}


