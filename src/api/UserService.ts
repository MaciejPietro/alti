import axios from "axios";
import { UsersResponse } from "../types/api";
import { User } from "../types/user";

const getUsers = async (pageParam: number) => {
  const { data } = await axios.get<UsersResponse>(
    `https://randomuser.me/api/?page=${pageParam}&results=10`
  );

  return { data: data?.results, next: pageParam + 1 };
};

const getUsersByName = (users: User[], searchName: string) => {
  // I pass users here because randomuser API doesnt support passing search paramater

  return users.filter((user) => {
    const firstName = user.name.first.toLocaleLowerCase();
    const lastName = user.name.last.toLocaleLowerCase();

    return `${firstName} ${lastName}`.includes(searchName.toLocaleLowerCase());
  });
};

export { getUsers, getUsersByName };
