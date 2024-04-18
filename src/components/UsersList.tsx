import { useQueryClient } from "@tanstack/react-query";
import { useUsers, useSearchUsers } from "../hooks/useUsers";
import { User } from "../types/user";
import { useState } from "react";

const UsersList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>("");

  const { status, data, error, isFetching, fetchNextPage } = useUsers();

  const fetchedUsers = data?.pages.map((page) => page.data).flat();

  const { data: searchData } = useSearchUsers(
    search,
    queryClient,
    fetchedUsers || []
  );

  const handleChangesQuery = (search: string) => {
    setSearch(search);
  };

  const usersList = (search ? searchData : fetchedUsers) || [];

  //   TODO sorry, but not time for implementation
  const debounce = (debouncedFn: void) => debouncedFn;

  //   TODO sorry, but not time for implementation. This should be taken from useInfiniteQuery
  const hasNextPage = true;

  return (
    <div className="container mx-auto p-8 border border-gray-200 rounded-2xl">
      <h1 className="text-2xl mb-8 text-blue-800 font-bold">People</h1>

      <input
        className="border border-gray-500 rounded-md py-2 px-3 mb-6"
        placeholder="Type name"
        onChange={(e) => debounce(handleChangesQuery(e.target.value))}
      />

      {status === "success" && search && !searchData?.length ? (
        <div>
          No results for: <span className="font-bold">{search}</span>
        </div>
      ) : null}

      {status === "pending" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div className="text-red">Error: {error.message}</div>
      ) : (
        <>
          <ul className="divide-y">
            {usersList.map((user: User) => (
              <li
                key={user.email}
                className="flex items-center gap-3 w-full py-2 "
              >
                <img
                  className="rounded-md"
                  src={user.picture.medium}
                  alt={user.email}
                />
                <div>
                  {user.name.first} {user.name.last} <br />
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
          <div>{isFetching ? "..." : " "}</div>
        </>
      )}

      {search || !hasNextPage ? null : (
        <button
          className="bg-blue-800 py-2 px-6 mx-auto rounded-md text-white flex items center justify-center mt-6"
          onClick={() => fetchNextPage()}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default UsersList;
