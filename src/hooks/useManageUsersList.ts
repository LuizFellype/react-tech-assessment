import { useQueryClient } from "@tanstack/react-query";
import { PaginatedSkipLimitResult } from "services/base/interface";
import { UserProfileData } from "services/userProfile/interface";
import { useState } from "react";
import { useGetUsers } from "./react-query/useGetUsers";

const defaultState = {
  pagination: 1,
  limit: 13,
  filteredUsers: undefined,
}

export const useManageUsersList = () => {
  const [pagination, setPagination] = useState<number>(defaultState.pagination);
  const [limit] = useState<number>(defaultState.limit);
  const [filteredUsers, setFilteredUsers] = useState<UserProfileData[] | undefined>(defaultState.filteredUsers);

  const { data, isLoading, error, isSuccess } = useGetUsers({ pagination, limit })

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
