import { QueryClient, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getUsers, getUsersByName } from "../api/UserService";
import { User } from "../types/user";

interface Page {
  data: User[];
  next: number;
}

export const useUsers = () => {
  return useInfiniteQuery<Page, Error>({
    queryKey: ["users"],
    queryFn: ({ pageParam }) => getUsers(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
  });
};

export const useSearchUsers = (
  search: string,
  queryClient: QueryClient,
  users: User[]
) =>
  useQuery({
    queryKey: [`users/${search}`],
    queryFn: () => {
      const cache = queryClient.getQueryData([`users/${search}`]);
      if (cache) return cache as User[];

      const data = getUsersByName(users, search);

      return data;
    },
  });
