import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Feedback } from "../types";

const MOCK_FEEDBACK: Feedback[] = [
  {
    id: BigInt(1),
    eventId: BigInt(5),
    userId: "user-1",
    userName: "Alex Chen",
    rating: 5,
    comment:
      "The International Food Festival was absolutely amazing! Great variety and the performances were top-notch.",
    submittedAt: BigInt(Date.now() * 1000000 - 5 * 24 * 3600 * 1000000000),
    eventTitle: "International Food Festival",
  },
  {
    id: BigInt(2),
    eventId: BigInt(5),
    userId: "user-2",
    userName: "Jordan Kim",
    rating: 4,
    comment:
      "Really enjoyed the event. Could have used more vegetarian options.",
    submittedAt: BigInt(Date.now() * 1000000 - 6 * 24 * 3600 * 1000000000),
    eventTitle: "International Food Festival",
  },
  {
    id: BigInt(3),
    eventId: BigInt(2),
    userId: "user-3",
    userName: "Morgan Lee",
    rating: 5,
    comment:
      "Met two amazing companies and got a job interview. Best career fair ever!",
    submittedAt: BigInt(Date.now() * 1000000 - 1 * 3600 * 1000000000),
    eventTitle: "Career Fair 2024",
  },
];

export function useFeedback(eventId?: bigint) {
  const { isAuthenticated } = useInternetIdentity();
  return useQuery<Feedback[]>({
    queryKey: ["feedback", eventId?.toString()],
    queryFn: async () => {
      if (eventId) return MOCK_FEEDBACK.filter((f) => f.eventId === eventId);
      return MOCK_FEEDBACK;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAllFeedback() {
  const { isAuthenticated } = useInternetIdentity();
  return useQuery<Feedback[]>({
    queryKey: ["feedback", "all"],
    queryFn: async () => MOCK_FEEDBACK,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAverageRating(eventId: bigint) {
  return useQuery<number>({
    queryKey: ["rating", eventId.toString()],
    queryFn: async () => {
      const relevant = MOCK_FEEDBACK.filter((f) => f.eventId === eventId);
      if (relevant.length === 0) return 0;
      return relevant.reduce((sum, f) => sum + f.rating, 0) / relevant.length;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      eventId: bigint;
      rating: number;
      comment: string;
    }) => {
      const feedback: Feedback = {
        id: BigInt(Date.now()),
        eventId: data.eventId,
        userId: "current-user",
        userName: "You",
        rating: data.rating,
        comment: data.comment,
        submittedAt: BigInt(Date.now() * 1000000),
      };
      return feedback;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      queryClient.invalidateQueries({
        queryKey: ["rating", variables.eventId.toString()],
      });
    },
  });
}
