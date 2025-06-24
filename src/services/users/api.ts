import { UserProfileData } from "services/userProfile/interface";
import { PaginatedSkipLimitResult } from "../base/interface";
import { RawUserData, UsersListService } from "./interface";

const normalizeRawUserData = (user: RawUserData): UserProfileData => ({
  id: user.id,
  avatar: user.image,
  email: user.email,
  name: `${user.firstName} ${user.lastName}`,
  first_name: user.firstName,
  last_name: user.lastName,
  slug: user.username,
})

export class UsersListApiService extends UsersListService {
  async getAll(page = 1, limit = 13): Promise<PaginatedSkipLimitResult<UserProfileData>> {
    const skipAmount = page > 0 ? (page - 1) * limit : 0;

    const uri = `users?limit=${limit}&skip=${skipAmount}`;
    const response = await this.get(uri);
    
    const { total, users } = response

    const cleanUsers = users?.map(normalizeRawUserData)

    return { list: cleanUsers, total };
  }
}
