import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import type { Event, UserProfile } from "../types";

// Static mock events data for showcase
export const MOCK_EVENTS: Event[] = [
  {
    id: BigInt(1),
    title: "Spring Arts Festival",
    description: "Annual celebration of arts, music, and culture on campus.",
    date: BigInt(Date.now() * 1000000 + 7 * 24 * 3600 * 1000000000),
    location: "Main Quad",
    capacity: BigInt(200),
    registeredCount: BigInt(150),
    waitlistedCount: BigInt(15),
    category: "Arts & Culture",
    status: "upcoming",
    organizer: "Arts Society",
  },
  {
    id: BigInt(2),
    title: "Career Fair 2024",
    description:
      "Connect with 50+ top employers and explore career opportunities.",
    date: BigInt(Date.now() * 1000000),
    location: "Student Center Hall A",
    capacity: BigInt(500),
    registeredCount: BigInt(150),
    waitlistedCount: BigInt(15),
    category: "Career",
    status: "ongoing",
    organizer: "Career Services",
  },
  {
    id: BigInt(3),
    title: "Guest Lecture: AI Ethics",
    description:
      "Distinguished professor discusses ethical implications of AI in society.",
    date: BigInt(Date.now() * 1000000 + 3 * 24 * 3600 * 1000000000),
    location: "Presidential Auditorium",
    capacity: BigInt(300),
    registeredCount: BigInt(150),
    waitlistedCount: BigInt(15),
    category: "Academic",
    status: "upcoming",
    organizer: "CS Department",
  },
  {
    id: BigInt(4),
    title: "Tech Innovation Summit",
    description:
      "Annual tech summit featuring student projects and industry demos.",
    date: BigInt(Date.now() * 1000000 + 14 * 24 * 3600 * 1000000000),
    location: "Engineering Building",
    capacity: BigInt(400),
    registeredCount: BigInt(150),
    waitlistedCount: BigInt(15),
    category: "Technology",
    status: "upcoming",
    organizer: "Tech Club",
  },
  {
    id: BigInt(5),
    title: "International Food Festival",
    description:
      "Experience cuisines from 30+ countries represented by student organizations.",
    date: BigInt(Date.now() * 1000000 - 7 * 24 * 3600 * 1000000000),
    location: "Campus Green",
    capacity: BigInt(1000),
    registeredCount: BigInt(980),
    waitlistedCount: BigInt(0),
    category: "Cultural",
    status: "past",
    organizer: "International Students Union",
  },
  {
    id: BigInt(6),
    title: "Research Symposium 2024",
    description: "Undergraduate research presentations across all disciplines.",
    date: BigInt(Date.now() * 1000000 + 21 * 24 * 3600 * 1000000000),
    location: "Library Conference Center",
    capacity: BigInt(200),
    registeredCount: BigInt(87),
    waitlistedCount: BigInt(0),
    category: "Academic",
    status: "upcoming",
    organizer: "Academic Affairs",
  },
];

export function useEvents() {
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => MOCK_EVENTS,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEvent(id: bigint) {
  return useQuery<Event | undefined>({
    queryKey: ["event", id.toString()],
    queryFn: async () => MOCK_EVENTS.find((e) => e.id === id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      event: Omit<Event, "id" | "registeredCount" | "waitlistedCount">,
    ) => {
      const newEvent: Event = {
        ...event,
        id: BigInt(Date.now()),
        registeredCount: BigInt(0),
        waitlistedCount: BigInt(0),
      };
      return newEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: Event) => event,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => id,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { isAuthenticated } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async (): Promise<UserProfile | null> => null,
    enabled: isAuthenticated,
    retry: false,
  });

  return {
    ...query,
    isFetched: isAuthenticated && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const queryClient = useQueryClient();
  const { setProfile, setProfileLoaded } = useAuthStore();

  return useMutation({
    mutationFn: async (profile: UserProfile) => profile,
    onSuccess: (profile) => {
      setProfile(profile);
      setProfileLoaded(true);
      queryClient.setQueryData(["currentUserProfile"], profile);
    },
  });
}
