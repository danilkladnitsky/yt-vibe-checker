import { useQuery } from "@tanstack/react-query"
import { CACHE_KEYS } from "../cache"
import { api } from "../client"

export const useGetBackendStatus = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.BACKEND_STATUS],
    queryFn: () =>
      api.health.healthControllerGetHealth().then((res) => res.json()),
    select: (data) => data.status,
  })
}
