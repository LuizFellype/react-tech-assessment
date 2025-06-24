import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginatedSkipLimitResult } from "services/base/interface";
import { UserProfileData } from "services/userProfile/interface";
import { useState } from "react";
import UsersListService from "services/users";

const defaultData = {
  list: [],
  total: 0,
  skip: 0,
  limit: 0
}

const defaultState = {
  pagination: 1,
  limit: 13,
  filteredUsers: undefined,
}

export const useManageUsersList = () => {
  const [pagination, setPagination] = useState<number>(defaultState.pagination);
  const [limit, setLimit] = useState<number>(defaultState.limit);
  const [filteredUsers, setFilteredUsers] = useState<UserProfileData[] | undefined>(defaultState.filteredUsers);

  const { data, isLoading, error, isSuccess } = useQuery({
    queryFn: async () => {
      try {
        const { list, total } = await UsersListService.getAll(pagination, limit)

        if (!list) return defaultData;

        return { list, total }
      } catch (error) {
        console.error("Error fetching users:", error);
        return defaultData
      }
    },
    queryKey: ["users", pagination, limit],
  })

  const queryClient = useQueryClient();

  const handleFilter = (keyToFilter: keyof UserProfileData) => (search: string) => {
    if (!search) return setFilteredUsers(undefined);

    const allQueries = queryClient
      .getQueriesData({
        queryKey: ["users"],
      })

    const filteredAllUsers = allQueries.reduce((acc, queryInfo) => {
      const fetchedQuery = queryInfo?.[1] as PaginatedSkipLimitResult<UserProfileData>
      const filteredByKey = fetchedQuery.list.filter(user =>
        `${user[keyToFilter]}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )

      return [...acc, ...filteredByKey]
    }, [] as UserProfileData[])

    setFilteredUsers(filteredAllUsers);
  }

  return {
    users: data?.list,
    filteredUsers,
    isLoading,
    total: data?.total,
    pagination,
    isSuccess,
    limit,
    error,
    handlePagination: setPagination,
    handleFilter
  };
}
