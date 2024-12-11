export const gameOptions = {
  slices: [
    { degrees: 25, color: "#ff0000", text: "GAME OVER" },
    { degrees: 45, color: "#fcda6a", text: "카타르로 여행 떠나기" },
    { degrees: 25, color: "#89cff0", text: "게임말 앞으로 10칸 이동" },
    { degrees: 43, color: "#b5e9a1", text: "게임말 뒤로 15칸 이동" },
    { degrees: 20, color: "#89cff0", text: "베트남으로 여행 떠나기" },
    { degrees: 42, color: "#ffe16f", text: "노르웨이로 여행 떠나기" },
    { degrees: 20, color: "#fe8c68", text: "다음 기회에" },
    { degrees: 12, color: "#89cff0", text: "게임알 1개, 도착지로 이동" },
    { degrees: 60, color: "#b5e9a1", text: "영국으로 여행 떠나기" },
    { degrees: 35, color: "#ffe16f", text: "불가리아로 여행 떠나기" },
    { degrees: 33, color: "#fe8c68", text: "다음 기회에" },
  ],
  rotationTimeRange: { min: 3000, max: 4500 },
  wheelRounds: { min: 2, max: 11 },
  wheelRadius: 300,
  strokeColor: 0xffffff,
  strokeWidth: 5,
};

export const secondWheelOptions = {
  slices: [
    { degrees: 25, color: "#ff0000", text: "WINNER", textColor: "#ffffff" },
    {
      degrees: 45,
      color: "#2c7000",
      text: "히든카드 1장 가져오기",
      textColor: "#ffffff",
    },
    {
      degrees: 45,
      color: "#ffdc0b",
      text: "무인도 탈출",
      textColor: "#000000",
    },
    {
      degrees: 45,
      color: "#2c7000",
      text: "미션카드 섞기",
      textColor: "#ffffff",
    },
    {
      degrees: 40,
      color: "#283a78",
      text: "싱가폴로 여행 떠나기",
      textColor: "#ffffff",
    },
    { degrees: 45, color: "#fe8c68", text: "꽝", textColor: "#ffffff" },
    {
      degrees: 45,
      color: "#283a78",
      text: "프랑스로 여행 떠나기",
      textColor: "#ffffff",
    },
    {
      degrees: 70,
      color: "#ffdc0b",
      text: "게임말 1개 잡기",
      textColor: "#000000",
    },
  ],
  wheelRadius: 350,
};
