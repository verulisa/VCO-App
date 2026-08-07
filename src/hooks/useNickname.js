import { useLocalStorage } from "./useLocalStorage";
import { generateNickname, nicknameEmoji } from "../utils/nicknameWords";

export function useNickname() {
  const [nickname, setNickname] = useLocalStorage("vco_nickname", null);

  function assignRandom() {
    setNickname(generateNickname());
  }

  function rename(custom) {
    const trimmed = custom.trim().slice(0, 24);
    if (trimmed) setNickname(trimmed);
  }

  return {
    nickname,
    emoji: nickname ? nicknameEmoji(nickname) : "🌱",
    hasNickname: Boolean(nickname),
    assignRandom,
    rename,
  };
}
