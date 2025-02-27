import { Chess } from "chess.js";
import { LichessGame, LichessOpenings, TreeNode } from "../types/chess";

const topGame: LichessGame = {
  uci: 'd2d4',
  id: 'QR5UbqUY',
  winner: null,
  black: {
    name: 'Caruana, F.',
    rating: 2818
  },
  white: {
    name: 'Carlsen, M.',
    rating: 2882
  },
  year: 2019,
  month: '2019-08'
}

export const openings: LichessOpenings = {
  white: 10,
  draws: 20,
  black: 30,
  opening: null,
  topGames: [topGame],
  moves: [
    {
      uci: 'e2e4',
      san: 'e4',
      averageRating: 2399,
      white: 1,
      draws: 2,
      black: 3,
    },
    {
      uci: 'd2d4',
      san: 'd4',
      averageRating: 2414,
      white: 4,
      draws: 5,
      black: 6,
    },
  ]
};

export const treeNode: TreeNode = {
  name: '',
  attributes: {
    white: 10,
    draws: 20,
    black: 30,
    topGames: [topGame],
    opening: null,
    averageRating: null,
    move: null
  },
  children: [
    {
      name: 'd2d4',
      attributes: {
        white: 4,
        draws: 5,
        black: 6,
        topGames: null,
        opening: {
          eco: 'A40',
          name: 'Queen\'s Pawn Game',
          uci: 'd2d4'
        },
        averageRating: 2414,
        move: new Chess().move('d2d4'),
      },
      children: []
    },
    {
      name: 'e2e4',
      attributes: {
        white: 1,
        draws: 2,
        black: 3,
        topGames: null,
        opening: {
          eco: 'B00',
          name: 'King\'s Pawn Game',
          uci: 'e2e4'
        },
        averageRating: 2399,
        move: new Chess().move('e2e4'),
      },
      children: []
    },
  ]
}
