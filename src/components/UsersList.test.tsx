import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UsersList from "./UsersList";
import { useUsers, useSearchUsers } from "../hooks/useUsers";

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}));
jest.mock("../hooks/useUsers", () => ({
  useUsers: jest.fn(),
  useSearchUsers: jest.fn(),
}));

const mockedUsers = [
  {
    email: "john@example.com",
    name: { first: "John", last: "Doe" },
    picture: { medium: "john.jpg" },
  },
  {
    email: "jane@example.com",
    name: { first: "Jane", last: "Doe" },
    picture: { medium: "jane.jpg" },
  },
];

describe("UsersList component", () => {
  beforeEach(() => {
    (useUsers as jest.Mock).mockReturnValue({
      status: "success",
      data: { pages: [{ data: mockedUsers }] },
      error: null,
      isFetching: false,
      fetchNextPage: jest.fn(),
    });
    (useSearchUsers as jest.Mock).mockReturnValue({
      data: [],
    });
  });

  test("renders the component", () => {
    render(<UsersList />);
    expect(screen.getByText("People")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type name")).toBeInTheDocument();
  });

  test("renders users list", () => {
    render(<UsersList />);
    expect(screen.getByAltText("john@example.com")).toBeInTheDocument();
    expect(screen.getByAltText("jane@example.com")).toBeInTheDocument();
  });

  test("displays loading message while fetching data", () => {
    (useUsers as jest.Mock).mockReturnValueOnce({ status: "pending" });
    render(<UsersList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error message if data fetching fails", () => {
    (useUsers as jest.Mock).mockReturnValueOnce({
      status: "error",
      error: { message: "Failed to fetch data" },
    });
    render(<UsersList />);
    expect(screen.getByText("Error: Failed to fetch data")).toBeInTheDocument();
  });

  test('displays "No results" message when search returns empty', () => {
    (useSearchUsers as jest.Mock).mockReturnValueOnce({ data: [] });
    render(<UsersList />);
    fireEvent.change(screen.getByPlaceholderText("Type name"), {
      target: { value: "foobar" },
    });
    expect(screen.getByText("No results for:")).toBeInTheDocument();
  });

  test('loads more users when "Load More" button is clicked', () => {
    (useUsers as jest.Mock).mockReturnValueOnce({
      status: "success",
      data: { pages: [{ data: mockedUsers }] },
      error: null,
      isFetching: false,
      fetchNextPage: jest.fn(),
    });
    (useUsers as jest.Mock).mockReturnValueOnce({
      status: "success",
      data: { pages: [{ data: mockedUsers }, { data: mockedUsers }] },
      error: null,
      isFetching: false,
      fetchNextPage: jest.fn(),
    });
    render(<UsersList />);
    fireEvent.click(screen.getByText("Load More"));
    expect(useUsers).toHaveBeenCalled();
  });
});
