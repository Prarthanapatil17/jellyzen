import { useQuery } from "@tanstack/react-query";
import type {
  Collectible,
  MeditationSessionDTO,
  UserProfileView,
} from "../backend.d";
import { useActor } from "./useActor";

export function useMeditationSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<MeditationSessionDTO[]>({
    queryKey: ["meditationSessions"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllMeditationSessions();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useCollectibles() {
  const { actor, isFetching } = useActor();
  return useQuery<Collectible[]>({
    queryKey: ["collectibles"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getCollectibles();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfileView | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}
