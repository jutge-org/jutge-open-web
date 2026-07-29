'use client'

import { JutgeApiClient } from './jutge_api_client'

const jutge = new JutgeApiClient()
jutge.JUTGE_API_URL = process.env.NEXT_PUBLIC_JUTGE_API_URL || 'https://api.jutge.org/api'
jutge.clientTTLs.set('problems.getAllAbstractProblems', 3600)
jutge.clientTTLs.set('problems.getAllProblems', 3600)

export default jutge
