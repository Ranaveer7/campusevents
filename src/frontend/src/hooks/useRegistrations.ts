import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Registration } from "../types";

const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: BigInt(1),
    eventId: BigInt(1),
    userId: "user-1",
    status: "registered",
    registeredAt: BigInt(Date.now() * 1000000 - 2 * 24 * 3600 * 1000000000),
    eventTitle: "Spring Arts Festival",
    eventDate: BigInt(Date.now() * 1000000 + 7 * 24 * 3600 * 1000000000),
    eventLocation: "Main Quad",
  },
  {
    id: BigInt(2),
    eventId: BigInt(2),
    userId: "user-1",
    status: "registered",
    registeredAt: BigInt(Date.now() * 1000000 - 5 * 24 * 3600 * 1000000000),
    eventTitle: "Career Fair 2024",
    eventDate: BigInt(Date.now() * 1000000),
    eventLocation: "Student Center Hall A",
  },
  {
    id: BigInt(3),
    eventId: BigInt(3),
    userId: "user-1",
    status: "waitlisted",
    registeredAt: BigInt(Date.now() * 1000000 - 1 * 24 * 3600 * 1000000000),
    eventTitle: "Guest Lecture: AI Ethics",
    eventDate: BigInt(Date.now() * 1000000 + 3 * 24 * 3600 * 1000000000),
    eventLocation: "Presidential Auditorium",
  },
];

export function useRegistrations() {
  const { isAuthenticated } = useInternetIdentity();
  return useQuery<Registration[]>({
    queryKey: ["registrations"],
    queryFn: async () => MOCK_REGISTRATIONS,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRegistrationsByEvent(eventId: bigint) {
  return useQuery<Registration[]>({
    queryKey: ["registrations", "event", eventId.toString()],
    queryFn: async () =>
      MOCK_REGISTRATIONS.filter((r) => r.eventId === eventId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: bigint) => {
      const reg: Registration = {
        id: BigInt(Date.now()),
        eventId,
        userId: "current-user",
        status: "registered",
        registeredAt: BigInt(Date.now() * 1000000),
      };
      return reg;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useCancelRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (registrationId: bigint) => registrationId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
