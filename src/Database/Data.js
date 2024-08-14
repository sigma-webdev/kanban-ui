import { v4 as uuid } from "uuid";

const Data = {
  themes: [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "halloween",
    "garden",
    "forest",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "autumn",
    "business",
    "night",
    "coffee",
    "winter",
  ],
  labels: [
    {
      id: uuid(),
      colorCode: "red",
      name: "High Priority",
    },
    {
      id: uuid(),
      colorCode: "brown",
      name: "Medium Priority",
    },
    {
      id: uuid(),
      colorCode: "green",
      name: "Low Priority",
    },
  ],
  assignee: [
    {
      id: uuid(),
      name: "Harvi",
      avatar: "https://avatars.githubusercontent.com/u/85826727?v=4",
    },
    {
      id: uuid(),
      name: "Mang",
      avatar: "https://avatars.githubusercontent.com/u/85826727?v=4",
    },
    {
      id: uuid(),
      name: "Vinay",
      avatar: "https://avatars.githubusercontent.com/u/85826727?v=4",
    },
  ],
  boards: JSON.parse(localStorage.getItem("boards") || "[]"),
};

export default Data;
