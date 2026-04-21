import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import type { Analytics } from "../types";

const MOCK_ANALYTICS: Analytics = {
  totalEvents: BigInt(398),
  totalRegistrations: BigInt(4332),
  averageAttendance: 90,
  upcomingEvents: BigInt(13),
  registrationsByCategory: [
    { category: "Technology", count: BigInt(1200) },
    { category: "Academic", count: BigInt(980) },
    { category: "Career", count: BigInt(850) },
    { category: "Arts & Culture", count: BigInt(650) },
    { category: "Cultural", count: BigInt(452) },
    { category: "Sports", count: BigInt(200) },
  ],
  registrationsByMonth: [
    { month: "Jan", count: BigInt(320) },
    { month: "Feb", count: BigInt(410) },
    { month: "Mar", count: BigInt(385) },
    { month: "Apr", count: BigInt(520) },
    { month: "May", count: BigInt(490) },
    { month: "Jun", count: BigInt(310) },
    { month: "Jul", count: BigInt(280) },
    { month: "Aug", count: BigInt(350) },
    { month: "Sep", count: BigInt(445) },
    { month: "Oct", count: BigInt(560) },
    { month: "Nov", count: BigInt(470) },
    { month: "Dec", count: BigInt(192) },
  ],
  topEvents: [
    {
      eventId: BigInt(2),
      title: "Career Fair 2024",
      registrations: BigInt(500),
    },
    {
      eventId: BigInt(5),
      title: "International Food Festival",
      registrations: BigInt(980),
    },
    {
      eventId: BigInt(4),
      title: "Tech Innovation Summit",
      registrations: BigInt(380),
    },
    {
      eventId: BigInt(1),
      title: "Spring Arts Festival",
      registrations: BigInt(200),
    },
    {
      eventId: BigInt(6),
      title: "Research Symposium 2024",
      registrations: BigInt(87),
    },
  ],
  departmentParticipation: [
    { department: "Engineering", count: BigInt(1450) },
    { department: "Business", count: BigInt(980) },
    { department: "Sciences", count: BigInt(750) },
    { department: "Arts", count: BigInt(620) },
    { department: "Medicine", count: BigInt(532) },
  ],
};

export function useAnalytics() {
  const { isAuthenticated } = useInternetIdentity();
  return useQuery<Analytics>({
    queryKey: ["analytics"],
    queryFn: async () => MOCK_ANALYTICS,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });
}
