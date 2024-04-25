import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Home2 from "../components/Home2";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Home2 Component Tests", () => {
  const mockLoginWithRedirect = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders without crashing", () => {
    render(<Home2 />);
    expect(screen.getByText("TODOs App")).toBeInTheDocument();
  });

  test("displays Login button when not authenticated", () => {
    render(<Home2 />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("displays Enter App button when authenticated", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Home2 />);
    expect(screen.getByText("Enter App")).toBeInTheDocument();
  });

  test("Login button triggers loginWithRedirect", () => {
    render(<Home2 />);
    fireEvent.click(screen.getByText("Login"));
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });

  test("Enter App button triggers navigation", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Home2 />);
    fireEvent.click(screen.getByText("Enter App"));
    expect(mockNavigate).toHaveBeenCalledWith("/app");
  });

  test("Signup button triggers loginWithRedirect with correct parameters", () => {
    render(<Home2 />);
    fireEvent.click(screen.getByText("Create Account"));
    expect(mockLoginWithRedirect).toHaveBeenCalledWith({
      screen_hint: "signup",
    });
  });
});
