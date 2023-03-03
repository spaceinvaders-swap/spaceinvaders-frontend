import { useState, useEffect } from 'react'
import request, { gql } from 'graphql-request'

const useGetParticipants = (subgraphAddress: string): string[] => {
  const [participants, setParticipants] = useState<string[]>([])
  useEffect(() => {
    const getParticipants = async () => {
      try {
        const response = await request(
          subgraphAddress,
          gql`
            query getTradingCompetitionParticipants {
              storm: team(id: "1") {
                userCount
              }
              flippers: team(id: "2") {
                userCount
              }
              invars: team(id: "3") {
                userCount
              }
            }
          `,
        )
        const storm = parseInt(response.storm.userCount, 10)
        const flippers = parseInt(response.flippers.userCount, 10)
        const invars = parseInt(response.invars.userCount, 10)
        const totalParticipants = storm + flippers + invars
        setParticipants([
          storm.toLocaleString(),
          flippers.toLocaleString(),
          invars.toLocaleString(),
          totalParticipants.toString(),
        ])
      } catch (error) {
        console.error('Failed to get participants data', error)
      }
    }
    if (participants.length === 0) {
      getParticipants()
    }
  }, [subgraphAddress, participants])
  return participants
}

export default useGetParticipants
