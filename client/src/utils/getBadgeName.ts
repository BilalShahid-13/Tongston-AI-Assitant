import { useLocation } from "@tanstack/react-router";


export function getBadgeName() {
  const location = useLocation().href.split('/').pop();
  const part1 = location?.slice(0, 6);
  const part2 = location?.slice(6, 100);
  return `${part1} ${part2}`;
}