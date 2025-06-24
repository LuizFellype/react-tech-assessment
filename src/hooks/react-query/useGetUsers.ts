import { useQuery } from "@tanstack/react-query";
import UsersListService from "services/users";

type UseGetUsersProps = {
    pagination?: number;
    limit?: number;
}
export const useGetUsers = ({ pagination, limit }: UseGetUsersProps) => {
  const queryResult = useQuery({
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

  return queryResult
}

const defaultData = {
  list: [],
  total: 0,
  skip: 0,
  limit: 0
}