import FakeService from "services/base/fakeService";
import { PaginatedSkipLimitResult } from "../base/interface";
import { UserProfileData } from "services/userProfile/interface";

const fakeUserForTestingPurpose: UserProfileData = {
  id: 4,
  avatar: 'https://picsum.photos/id/4/200/300',
  email: 'miles.cummerata@gmail.com',
  name: 'Miles Cummerata',
  first_name: 'Miles',
  last_name: 'Cummerata',
  slug: 'mCum',
}
const fakeUser: UserProfileData = {
  avatar: 'https://picsum.photos/id/4/200/300',
  email: 'mock@gmail.com',
  name: 'Luiz Fellype',
  first_name: 'Luiz',
  last_name: 'Fellype',
  slug: 'Lype',
}

export class UsersListFakeService extends FakeService<UserProfileData> {
  protected fakePagination = (
    data: UserProfileData,
    page = 1,
    numberOfEntries = 13
  ): PaginatedSkipLimitResult<UserProfileData> => ({
    list: Array.from({ length: numberOfEntries }, (_, i) => i + 1).map((i) => {
      const id = page < 2 ? i : (page - 1) * numberOfEntries + i;

      return id === 4 ? fakeUserForTestingPurpose : ({
        ...data,
        avatar: `https://picsum.photos/id/${i}/200/300`,
        id,
      })
    }),
    total: numberOfEntries * 2, // to have at least 2 pages of data 
    skip: (page * numberOfEntries) - numberOfEntries,
    limit: numberOfEntries,
  });
  
  async getAll(page = 1, limit = 13): Promise<PaginatedSkipLimitResult<UserProfileData>> {
    return this.simulatePaginatedRequest(
      () => this.fakePagination(fakeUser, page, limit),
      () => { }
    );
  }
}
