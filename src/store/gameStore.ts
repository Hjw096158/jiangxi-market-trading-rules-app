import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, User } from '../types';

const initialState: GameState = {
  currentUser: null,
  isPlaying: false,
  currentLevel: 1,
  currentSection: 1,
  score: 0,
  stars: 0,
  achievements: [],
  leaderboard: [],
};

// 定义 store 类型
interface GameStore extends GameState {
  setCurrentUser: (user: User) => void;
  updateProgress: (level: number, section: number) => void;
  addScore: (points: number) => void;
  addStars: (stars: number) => void;
  addAchievement: (achievement: string) => void;
  updateLeaderboard: (username: string, score: number) => void;
  resetGame: () => void;
}

// 创建 store - 重新添加 persist 中间件
export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentUser: (user: User) => set({ currentUser: user }),
      
      updateProgress: (level: number, section: number) => set({ currentLevel: level, currentSection: section }),
      
      addScore: (points: number) => set((state) => ({
        score: state.score + points
      })),
      
      addStars: (stars: number) => set((state) => ({
        stars: Math.min(state.stars + stars, 3) // 最多3颗星
      })),
      
      addAchievement: (achievement: string) => set((state) => {
        if (!state.achievements.includes(achievement)) {
          return {
            achievements: [...state.achievements, achievement]
          };
        }
        return state;
      }),
      
      updateLeaderboard: (username: string, score: number) => set((state) => {
        const newEntry = { username, score };
        const updatedLeaderboard = [...state.leaderboard, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // 只保留前10名
        
        return { leaderboard: updatedLeaderboard };
      }),
      
      resetGame: () => set(initialState)
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        leaderboard: state.leaderboard
      })
    }
  )
);
