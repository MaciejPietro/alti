import axios from "axios";
import { getUsers, getUsersByName } from "./UserService";
import { User } from "../types/user";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UserService", () => {
  describe("getUsers", () => {
    it("fetches users from the API", async () => {
      const mockUsersResponse = {
        data: {
          results: [{ name: { first: "John", last: "Doe" } }],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockUsersResponse); // Update axios mocking

      const { data, next } = await getUsers(1);

      expect(data).toEqual(mockUsersResponse.data.results);
      expect(next).toEqual(2);
      expect(axios.get).toHaveBeenCalledWith(
        "https://randomuser.me/api/?page=1&results=10"
      );
    });
  });

  describe("getUsersByName", () => {
    it("filters users by name", () => {
      const users = [
        { name: { first: "John", last: "Doe" } },
        { name: { first: "Jane", last: "Smith" } },
      ];

      const filteredUsers = getUsersByName(users as User[], "john");

      console.log("xdx", filteredUsers);

      expect(filteredUsers).toHaveLength(1);
      expect(filteredUsers[0].name.first).toEqual("John");
      expect(filteredUsers[0].name.last).toEqual("Doe");
    });

    it("returns empty array if no matching users found", () => {
      const users = [
        { name: { first: "John", last: "Doe" } },
        { name: { first: "Jane", last: "Smith" } },
      ];

      const filteredUsers = getUsersByName(users as User[], "nonexistent");

      expect(filteredUsers).toHaveLength(0);
    });
  });
});
