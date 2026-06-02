const memoryCards = [
  {
    id: 1,
    image: "/images/card1.png",
    matchId: "card1"
  },
  {
    id: 2,
    image: "/images/card1.png",
    matchId: "card1"
  },

  {
    id: 3,
    image: "/images/card2.png",
    matchId: "card2"
  },
  {
    id: 4,
    image: "/images/card2.png",
    matchId: "card2"
  },

  {
    id: 5,
    image: "/images/card3.png",
    matchId: "card3"
  },
  {
    id: 6,
    image: "/images/card3.png",
    matchId: "card3"
  },

  {
    id: 7,
    image: "/images/card4.png",
    matchId: "card4"
  },
  {
    id: 8,
    image: "/images/card4.png",
    matchId: "card4"
  },

  {
    id: 9,
    image: "/images/card5.png",
    matchId: "card5"
  },
  {
    id: 10,
    image: "/images/card5.png",
    matchId: "card5"
  }
];

function shuffleCards(cards) {
  return cards.sort(() => Math.random() - 0.5);
}

const shuffledCards = shuffleCards(memoryCards);

export default shuffledCards;
