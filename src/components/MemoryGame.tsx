import { useState, useEffect } from 'react';
import '../styles/MemoryGame.css';

// カードに使用する絵文字
const emojis = [
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // ゲームの初期化
  useEffect(() => {
    initGame();
  }, []);

  // カードのシャッフルと初期化
  const initGame = () => {
    // カードをシャッフル
    const shuffledEmojis = [...emojis].sort(() => Math.random() - 0.5);

    // カードの状態を設定
    const newCards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
  };

  // カードをクリックした時の処理
  const handleCardClick = (id: number) => {
    // すでにマッチしているか裏返されているカードは無視
    if (
      cards[id].isMatched ||
      cards[id].isFlipped ||
      flippedCards.length === 2
    ) {
      return;
    }

    // カードを裏返す
    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    // 裏返したカードを記録
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // 2枚のカードが裏返された場合
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);

      // 2枚のカードが一致するか確認
      if (cards[newFlippedCards[0]].emoji === cards[newFlippedCards[1]].emoji) {
        // マッチした場合
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[newFlippedCards[0]].isMatched = true;
          matchedCards[newFlippedCards[1]].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);

          // ゲーム終了チェック
          if (matchedCards.every((card) => card.isMatched)) {
            setGameOver(true);
          }
        }, 500);
      } else {
        // マッチしなかった場合
        setTimeout(() => {
          const unmatchedCards = [...cards];
          unmatchedCards[newFlippedCards[0]].isFlipped = false;
          unmatchedCards[newFlippedCards[1]].isFlipped = false;
          setCards(unmatchedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // ゲームをリセット
  const resetGame = () => {
    initGame();
  };

  return (
    <div className='memory-game'>
      <h1>記憶カードゲーム</h1>
      <div className='game-info'>
        <p>手数: {moves}</p>
        <button onClick={resetGame}>リセット</button>
      </div>

      <div className='card-grid'>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? 'flipped' : ''} ${
              card.isMatched ? 'matched' : ''
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className='card-inner'>
              <div className='card-front'>？</div>
              <div className='card-back'>{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className='game-over'>
          <h2>ゲームクリア！</h2>
          <p>手数: {moves}回でクリアしました！</p>
          <button onClick={resetGame}>もう一度プレイ</button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
